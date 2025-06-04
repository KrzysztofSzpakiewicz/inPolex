import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native'; // Import Stripe hook
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
import SelectDropdown from 'react-native-select-dropdown';

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
	const [searchType, setSearchType] = useState('email');
	const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
	const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
	const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
	const [paymentAmount, setPaymentAmount] = useState<number>(1000); // Amount in cents (e.g., 10.00 PLN)
	const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Stripe hook

	try {
		parsedData = data ? JSON.parse(data as string).data : null;
	} catch (error) {
		console.error('Error parsing data:', error);
	}

	const handleBackPress = () => {
		router.replace('/DashboardScreen/DashboardScreen');
		return true;
	};

	const handleSearch = () => {
		console.log(`Searching for ${searchText} with type ${searchType}`);
		// Implement search logic here
	};

	const handleProceedToPayment = async () => {
		if (!selectedPackageId || !selectedAddressId || !selectedDeliveryId) {
			alert(
				'Please select a package, address, and delivery option before proceeding to payment.',
			);
			return;
		}

		// Hardcoded client secret for TESTING ONLY (replace with your test client secret)
		const clientSecret = 'pi_3RWDSxR6MsN6InsO1TflnJhN_secret_EkmlPUex4LMBRuPsDnXuv9taN'; // Obtain from Stripe Dashboard or CLI

		try {
			// Initialize the Payment Sheet
			const { error: initError } = await initPaymentSheet({
				paymentIntentClientSecret: clientSecret,
				merchantDisplayName: 'Your App Name',
				// Optional: Configure appearance to match your theme
				style: 'alwaysDark', // or 'alwaysLight' to match your app's theme
			});

			if (initError) {
				console.error('Error initializing payment sheet:', initError);
				alert(`Error: ${initError.message}`);
				return;
			}

			// Present the Payment Sheet
			const { error: paymentError } = await presentPaymentSheet();

			if (paymentError) {
				console.error('Payment error:', paymentError);
				alert(`Payment failed: ${paymentError.message}`);
			} else {
				alert('Payment successful!');
				// Optionally, navigate to a confirmation screen
				// router.push('/PaymentConfirmationScreen');
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

	const searchOptions = ['email', 'phoneNumber', 'username'];

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
							{/* Search Input and Selector */}
							<View style={styles.searchContainer}>
								<Text style={styles.label}>Search:</Text>
								<TextInput
									style={styles.input}
									value={searchText}
									onChangeText={setSearchText}
									placeholder="Search user"
									placeholderTextColor={Colors.light}
								/>
								<SelectDropdown
									data={searchOptions}
									onSelect={selectedItem => setSearchType(selectedItem)}
									defaultValue={searchType}
									buttonStyle={styles.selector}
									buttonTextStyle={{
										fontSize: FontSizes.medium,
										color: Colors.light,
										fontFamily: FontNames.regular,
									}}
									dropdownStyle={{
										backgroundColor: Colors.grey,
										borderRadius: 8,
									}}
									rowTextStyle={{
										fontSize: FontSizes.medium,
										color: Colors.light,
										fontFamily: FontNames.regular,
									}}
								/>
								<TouchableOpacity
									style={styles.searchButton}
									onPress={handleSearch}
								>
									<Text style={styles.buttonText}>Search</Text>
								</TouchableOpacity>
							</View>

							{/* Display packageId */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Package ID:</Text>
								<Text style={styles.sectionContent}>{parsedData.packageId}</Text>
							</View>

							{/* Display addresses with selection */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Addresses:</Text>
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
												setPaymentAmount(pkg.price * 100); // Update payment amount based on selected package (in cents)
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
												); // Add delivery price to payment amount (in cents)
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
