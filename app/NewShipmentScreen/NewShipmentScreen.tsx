import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import BackButton from '../../components/BackButton';
import { Colors, FontSizes, FontNames } from '../../constants/theme';
import {
	View,
	Text,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
	NativeEventSubscription,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { styles } from './NewShipmentScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import imPolex from '../../assets/inPolEx.png';
import { useLocalSearchParams } from 'expo-router';
import { searchUserByUsername, postCreatePaymentIntent } from '../../constants/Connections'; // Added postCreatePaymentIntent import
import { AxiosResponse } from 'axios';

// Type definitions for props
interface Address {
	id: number;
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	apartment: string;
	latitude: number;
	longitude: number;
}

interface Dimensions {
	width: number;
	height: number;
	depth: number;
}

interface PackageSize {
	id: number;
	size: string;
	price: number;
	maxWeight: number;
	dimensions: Dimensions;
	active: boolean;
	createdAt: string;
}

interface Delivery {
	id: number;
	price: number;
	deliveryDate: string;
}

interface ShipmentData {
	topicName: string;
	adresses: Address[];
	availablePackageSizes: PackageSize[];
	packageId: number;
	possibleDeliveries: Delivery[];
	earliestPickupDate: string;
}

const NewShipmentScreen: React.FC = () => {
	const { data } = useLocalSearchParams();
	let parsedData: ShipmentData | null = null;
	const [searchText, setSearchText] = useState('');
	const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
	const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
	const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
	const [paymentAmount, setPaymentAmount] = useState<number>(1000); // Amount in cents
	const [searchedAddresses, setSearchedAddresses] = useState<Address[]>([]); // State for searched addresses
	const { initPaymentSheet, presentPaymentSheet } = useStripe();

	try {
		parsedData = data ? JSON.parse(data as string).data : null;
	} catch (error) {
		console.error('Error parsing data:', error);
	}

	const handleBackPress = () => {
		router.replace('/DashboardScreen/DashboardScreen');
		return true;
	};

	const handleSearch = async () => {
		if (!searchText.trim()) {
			alert('Please enter a username to search.');
			return;
		}

		try {
			const response: AxiosResponse = await searchUserByUsername(searchText);
			const addresses = response.data.adresses || [];
			setSearchedAddresses(addresses);
			if (addresses.length === 0) {
				alert('No addresses found for this username.');
			}
		} catch (error) {
			console.error('Error searching user:', error);
			alert('An error occurred while searching for the user.');
		}
	};

	const handleProceedToPayment = async () => {
		if (!selectedPackageId || !selectedAddressId || !selectedDeliveryId) {
			alert(
				'Please select a package, address, and delivery option before proceeding to payment.',
			);
			return;
		}

		try {
			// Make POST request to create payment intent
			const response: AxiosResponse = await postCreatePaymentIntent({
				amount: paymentAmount * 100, // Amount in cents
				currency: 'pln',
				packageId: parsedData?.packageId,
			});
			console.log('Payment intent response:', response.data);

			const clientSecret = response.data.clientSecret;

			if (!clientSecret) {
				throw new Error('No client secret received from server.');
			}

			// Initialize payment sheet with the client secret
			const { error: initError } = await initPaymentSheet({
				paymentIntentClientSecret: clientSecret,
				merchantDisplayName: 'Your App Name',
				style: 'alwaysDark',
			});

			if (initError) {
				console.error('Error initializing payment sheet:', initError);
				alert(`Error: ${initError.message}`);
				return;
			}

			// Present payment sheet
			const { error: paymentError } = await presentPaymentSheet();

			if (paymentError) {
				console.error('Payment error:', paymentError);
				alert(`Payment failed: ${paymentError.message}`);
			} else {
				alert('Payment successful!');
			}
		} catch (error) {
			console.error('Payment error:', error);
			alert('An error occurred while processing the payment.');
		}
	};

	useEffect(() => {
		const subscription: NativeEventSubscription = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress,
		);

		return () => {
			subscription.remove();
		};
	}, []);

	if (!parsedData) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.titleText}>No data to display</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
				style={styles.container}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.backButton}>
							<BackButton onPress={handleBackPress} />
							<Image source={imPolex} style={styles.logo} />
							<View style={{ width: 30, height: 30 }} />
						</View>

						<View style={styles.formContainer}>
							{/* Search Input */}
							<View style={styles.searchContainer}>
								<Text style={styles.label}>Search by Username:</Text>
								<TextInput
									style={styles.input}
									value={searchText}
									onChangeText={setSearchText}
									placeholder="Enter username"
									placeholderTextColor={Colors.light}
								/>
								<TouchableOpacity
									style={styles.searchButton}
									onPress={handleSearch}
								>
									<Text style={styles.buttonText}>Search</Text>
								</TouchableOpacity>
							</View>

							{/* Display searched addresses */}
							{searchedAddresses.length > 0 && (
								<View style={styles.section}>
									<Text style={styles.sectionTitle}>Searched Addresses:</Text>
									{searchedAddresses.map((address, index) => (
										<TouchableOpacity
											key={address.id}
											style={[
												styles.itemContainer,
												selectedAddressId === address.id &&
													styles.selectedPackageItem,
											]}
											onPress={() => setSelectedAddressId(address.id)}
										>
											<Text style={styles.itemTitle}>
												Address {index + 1}:
											</Text>
											<Text style={styles.itemText}>
												Country: {address.country}
											</Text>
											<Text style={styles.itemText}>
												City: {address.city}
											</Text>
											<Text style={styles.itemText}>
												Street: {address.street}
											</Text>
											<Text style={styles.itemText}>
												Number: {address.number}
											</Text>
											<Text style={styles.itemText}>
												Postal Code: {address.postalCode}
											</Text>
											<Text style={styles.itemText}>
												Apartment: {address.apartment || 'None'}
											</Text>
											<Text style={styles.itemText}>
												Latitude: {address.latitude.toFixed(6)}
											</Text>
											<Text style={styles.itemText}>
												Longitude: {address.longitude.toFixed(6)}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							)}

							{/* Display packageId */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Package ID:</Text>
								<Text style={styles.sectionContent}>{parsedData.packageId}</Text>
							</View>

							{/* Display addresses with selection */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Your Addresses:</Text>
								{parsedData.adresses?.length > 0 ? (
									parsedData.adresses.map((address, index) => (
										<TouchableOpacity
											key={address.id}
											style={[
												styles.itemContainer,
												selectedAddressId === address.id &&
													styles.selectedPackageItem,
											]}
											onPress={() => setSelectedAddressId(address.id)}
										>
											<Text style={styles.itemTitle}>
												Address {index + 1}:
											</Text>
											<Text style={styles.itemText}>
												Country: {address.country}
											</Text>
											<Text style={styles.itemText}>
												City: {address.city}
											</Text>
											<Text style={styles.itemText}>
												Street: {address.street}
											</Text>
											<Text style={styles.itemText}>
												Number: {address.number}
											</Text>
											<Text style={styles.itemText}>
												Postal Code: {address.postalCode}
											</Text>
											<Text style={styles.itemText}>
												Apartment: {address.apartment || 'None'}
											</Text>
											<Text style={styles.itemText}>
												Latitude: {address.latitude.toFixed(6)}
											</Text>
											<Text style={styles.itemText}>
												Longitude: {address.longitude.toFixed(6)}
											</Text>
										</TouchableOpacity>
									))
								) : (
									<Text style={styles.itemText}>No addresses available</Text>
								)}
							</View>

							{/* Display available package sizes */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Available Package Sizes:</Text>
								{parsedData.availablePackageSizes?.length > 0 ? (
									parsedData.availablePackageSizes.map((pkg, index) => (
										<TouchableOpacity
											key={pkg.id}
											style={[
												styles.packageItemContainer,
												selectedPackageId === pkg.id &&
													styles.selectedPackageItem,
											]}
											onPress={() => {
												setSelectedPackageId(pkg.id);
												setPaymentAmount(pkg.price * 100);
											}}
										>
											<Text style={styles.itemTitle}>
												Package {index + 1}:
											</Text>
											<Text style={styles.itemText}>Size: {pkg.size}</Text>
											<Text style={styles.itemText}>
												Price: {pkg.price} PLN
											</Text>
											<Text style={styles.itemText}>
												Max Weight: {pkg.maxWeight} kg
											</Text>
											<Text style={styles.itemText}>Dimensions:</Text>
											<Text style={styles.itemText}>
												- Width: {pkg.dimensions?.width ?? 'None'} cm
											</Text>
											<Text style={styles.itemText}>
												- Height: {pkg.dimensions?.height ?? 'None'} cm
											</Text>
											<Text style={styles.itemText}>
												- Depth: {pkg.dimensions?.depth ?? 'None'} cm
											</Text>
											<Text style={styles.itemText}>
												Active: {pkg.active ? 'Yes' : 'No'}
											</Text>
											<Text style={styles.itemText}>
												Created At: {pkg.createdAt}
											</Text>
										</TouchableOpacity>
									))
								) : (
									<Text style={styles.itemText}>No package sizes available</Text>
								)}
							</View>

							{/* Display possible deliveries with selection */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Possible Deliveries:</Text>
								{parsedData.possibleDeliveries?.length > 0 ? (
									parsedData.possibleDeliveries.map((delivery, index) => (
										<TouchableOpacity
											key={delivery.id}
											style={[
												styles.itemContainer,
												selectedDeliveryId === delivery.id &&
													styles.selectedPackageItem,
											]}
											onPress={() => {
												setSelectedDeliveryId(delivery.id);
												setPaymentAmount(
													prev => prev + delivery.price * 100,
												);
											}}
										>
											<Text style={styles.itemTitle}>
												Delivery {index + 1}:
											</Text>
											<Text style={styles.itemText}>
												Price: {delivery.price} PLN
											</Text>
											<Text style={styles.itemText}>
												Delivery Date: {delivery.deliveryDate}
											</Text>
										</TouchableOpacity>
									))
								) : (
									<Text style={styles.itemText}>No deliveries available</Text>
								)}
							</View>

							{/* Display earliestPickupDate */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Estimated Pickup Date:</Text>
								<Text style={styles.sectionContent}>
									{new Date(parsedData.earliestPickupDate).toLocaleString(
										'en-US',
										{
											dateStyle: 'medium',
											timeStyle: 'short',
										},
									)}
								</Text>
							</View>

							{/* Proceed to Payment Button */}
							<TouchableOpacity
								style={styles.proceedButton}
								onPress={handleProceedToPayment}
							>
								<Text style={styles.buttonText}>
									Proceed to Payment ({(paymentAmount / 100).toFixed(2)} PLN)
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default NewShipmentScreen;
