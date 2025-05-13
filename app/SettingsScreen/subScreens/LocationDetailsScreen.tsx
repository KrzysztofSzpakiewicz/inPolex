import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	BackHandler,
	TextInput,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/theme';
import BackButton from '../../../components/BackButton';
import { styles } from './LocationDetailsScreen.styles';

import { Image } from 'react-native';
import imPolex from '../../../assets/inPolEx.png';

interface LocationDetails {
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	Latitude: number;
	Longitude: number;
	apartment?: string;
}

const LocationDetailsScreen: React.FC = () => {
	const { location } = useLocalSearchParams();
	const initialLocation = location ? JSON.parse(location as string) : null;

	const [locationDetails, setLocationDetails] = useState<LocationDetails>({
		country: initialLocation?.country || '',
		city: initialLocation?.city || '',
		street: initialLocation?.street || '',
		number: initialLocation?.number || '',
		postalCode: initialLocation?.postalCode || '',
		latitude: initialLocation?.latitude || 0,
		longitude: initialLocation?.longitude || 0,
		apartment: initialLocation?.apartment || '',
	});

	const handleBackPress = () => {
		router.replace('/SettingsScreen/subScreens/MapScreen');
		return true;
	};

	useEffect(() => {
		const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => {
			subscription.remove();
		};
	}, []);

	const handleInputChange = (field: keyof LocationDetails, value: string) => {
		setLocationDetails(prev => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAdd = () => {
		// Placeholder for Add button functionality
		console.log('Add button pressed');
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={Colors.darkGrey} />
			<View style={styles.backButton}>
				<BackButton onPress={handleBackPress} />
				<Image source={imPolex} resizeMode="contain" />
				<View style={{ width: 30, height: 30 }} />
			</View>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.formContainer}>
					{[
						{ label: 'Kraj', field: 'country', value: locationDetails.country },
						{ label: 'Miasto', field: 'city', value: locationDetails.city },
						{ label: 'Ulica', field: 'street', value: locationDetails.street },
						{ label: 'Numer', field: 'number', value: locationDetails.number },
						{
							label: 'Mieszkanie',
							field: 'apartment',
							value: locationDetails.apartment,
						},
						{
							label: 'Kod pocztowy',
							field: 'postalCode',
							value: locationDetails.postalCode,
						},
					].map(({ label, field, value }) => (
						<View key={field} style={styles.inputContainer}>
							<Text style={styles.label}>{label}</Text>
							<TextInput
								style={styles.input}
								value={value}
								onChangeText={text =>
									handleInputChange(field as keyof LocationDetails, text)
								}
								keyboardType="default"
							/>
						</View>
					))}

					<TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
						<Text style={styles.buttonText}>Dodaj</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default LocationDetailsScreen;
