import React, { useEffect, useState } from 'react';
import BackButton from '../../../components/BackButton';
import {
	View,
	Text,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
	NativeEventSubscription,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { styles } from './EditSingleAddressScreen.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Colors } from '../../../constants/theme';
import imPolex from '../../../assets/inPolEx.png';
import { AxiosResponse } from 'axios';
import { putSingleAddress } from '../../../constants/Connections';

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

interface EditAddressPayload {
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	apartment: string;
	latitude: number;
	longitude: number;
}

const EditAddressScreen: React.FC = () => {
	const { address } = useLocalSearchParams();
	const parsedAddress: Address = address ? JSON.parse(address as string) : {};

	const [country, setCountry] = useState<string>(parsedAddress.country || '');
	const [city, setCity] = useState<string>(parsedAddress.city || '');
	const [street, setStreet] = useState<string>(parsedAddress.street || '');
	const [number, setNumber] = useState<string>(parsedAddress.number || '');
	const [postalCode, setPostalCode] = useState<string>(parsedAddress.postalCode || '');
	const [apartment, setApartment] = useState<string>(parsedAddress.apartment || '');
	const [latitude, setLatitude] = useState<string>(parsedAddress.latitude?.toString() || '');
	const [longitude, setLongitude] = useState<string>(parsedAddress.longitude?.toString() || '');

	// Handle back press
	const handleBackPress = () => {
		router.replace('/SettingsScreen/subScreens/EditAddressesScreen');
		return true;
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

	// Save changes by calling putSingleAddress
	const handleSaveChanges: () => void = async () => {
		const payload: EditAddressPayload = {
			country,
			city,
			street,
			number,
			postalCode,
			apartment,
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
		};

		try {
			const response: AxiosResponse = await putSingleAddress(payload, parsedAddress.id);
			console.log('Address updated successfully:', response.data);
			// TODO: Optionally navigate back or show success message
			// router.replace('/SettingsScreen/subScreens/EditAddressesScreen');
		} catch (error) {
			console.error('Error updating address:', error);
			// TODO: Show error message to user if needed
		}
	};

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
							<Image source={imPolex} resizeMode="contain" />
							<View style={{ width: 30, height: 30 }} />
						</View>

						<View style={styles.formContainer}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Country</Text>
								<TextInput
									style={styles.input}
									value={country}
									onChangeText={setCountry}
									placeholder="Enter country"
									placeholderTextColor={Colors.grey}
									autoCapitalize="words"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>City</Text>
								<TextInput
									style={styles.input}
									value={city}
									onChangeText={setCity}
									placeholder="Enter city"
									placeholderTextColor={Colors.grey}
									autoCapitalize="words"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Street</Text>
								<TextInput
									style={styles.input}
									value={street}
									onChangeText={setStreet}
									placeholder="Enter street"
									placeholderTextColor={Colors.grey}
									autoCapitalize="words"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Number</Text>
								<TextInput
									style={styles.input}
									value={number}
									onChangeText={setNumber}
									placeholder="Enter number"
									placeholderTextColor={Colors.grey}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Postal Code</Text>
								<TextInput
									style={styles.input}
									value={postalCode}
									onChangeText={setPostalCode}
									placeholder="Enter postal code"
									placeholderTextColor={Colors.grey}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Apartment</Text>
								<TextInput
									style={styles.input}
									value={apartment}
									onChangeText={setApartment}
									placeholder="Enter apartment"
									placeholderTextColor={Colors.grey}
								/>
							</View>

							<TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
								<Text style={styles.buttonText}>Save Changes</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default EditAddressScreen;
