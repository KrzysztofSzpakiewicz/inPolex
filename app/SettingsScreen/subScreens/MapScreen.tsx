import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import BackButton from '../../../components/BackButton';
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
	NativeEventSubscription,
	TouchableOpacity,
	StatusBar,
} from 'react-native';
import { styles } from './MapScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../../../constants/theme';
import imPolex from '../../../assets/inPolEx.png';

interface MarkerData {
	id: string;
	coordinate: {
		latitude: number;
		longitude: number;
	};
	title: string;
	description: string;
}

interface LocationDetails {
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	latitude: number;
	longitude: number;
}

const MapScreen: React.FC = () => {
	// Default region (center of Poland)
	const [region, setRegion] = useState<Region>({
		latitude: 52.2297,
		longitude: 21.0122,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	// State for single marker
	const [marker, setMarker] = useState<MarkerData | null>(null);

	// State for location details
	const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);

	// State to control marker info visibility
	const [showMarkerInfo, setShowMarkerInfo] = useState(false);

	const handleBackPress = (): boolean => {
		router.replace('/SettingsScreen/SettingsScreen');
		return true;
	};

	// Handler for map press to add a single marker
	const handleMapPress = async (e: any) => {
		if (marker) return; // Prevent adding more markers

		const newMarker: MarkerData = {
			id: Date.now().toString(),
			coordinate: e.nativeEvent.coordinate,
			title: 'Wybrana lokalizacja',
			description: `Dodano o ${new Date().toLocaleTimeString()}`,
		};

		setMarker(newMarker);
		setShowMarkerInfo(true);

		// Get address details
		try {
			const address = await Location.reverseGeocodeAsync({
				latitude: newMarker.coordinate.latitude,
				longitude: newMarker.coordinate.longitude,
			});

			if (address && address.length > 0) {
				const addr = address[0];
				setLocationDetails({
					country: addr.country || 'Unknown',
					city: addr.city || 'Unknown',
					street: addr.street || 'Unknown',
					number: addr.streetNumber || 'Unknown',
					postalCode: addr.postalCode || 'Unknown',
					latitude: newMarker.coordinate.latitude,
					longitude: newMarker.coordinate.longitude,
				});
			}
		} catch (error) {
			console.log('Error reverse geocoding: ', error);
		}
	};

	// Handler for marker press
	const handleMarkerPress = () => {
		if (marker) {
			setShowMarkerInfo(true);
		}
	};

	// Close marker info
	const handleCloseMarkerInfo = () => {
		setShowMarkerInfo(false);
		setMarker(null); // Remove marker when closing
	};

	// Handler for Next button
	const handleNext = () => {
		if (locationDetails) {
			// Navigate to a new screen or show details
			router.replace({
				pathname: 'SettingsScreen/subScreens/LocationDetailsScreen',
				params: { location: JSON.stringify(locationDetails) },
			});
		}
	};

	useEffect(() => {
		const subscription: NativeEventSubscription = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress,
		);

		// Request location permissions and get current location
		const getLocationAsync = async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();

				if (status === 'granted') {
					const location = await Location.getCurrentPositionAsync({});
					setRegion({
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					});
				}
			} catch (error) {
				console.log('Error getting location: ', error);
			}
		};

		getLocationAsync();

		return () => {
			subscription.remove();
		};
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={Colors.darkGrey} />

			{/* Map Container */}
			<View style={styles.mapContainer}>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					region={region}
					onRegionChangeComplete={setRegion}
					onPress={handleMapPress}
					showsUserLocation={true}
					showsMyLocationButton={true}
				>
					{marker && (
						<Marker
							key={marker.id}
							coordinate={marker.coordinate}
							title={marker.title}
							description={marker.description}
							onPress={handleMarkerPress}
							pinColor={Colors.red}
						/>
					)}
				</MapView>
			</View>

			{/* Header */}
			<View style={styles.header}>
				<BackButton onPress={handleBackPress} />
				<Image source={imPolex} resizeMode="contain" />
				<View style={{ width: 30, height: 30 }} />
			</View>

			{/* Marker Info Panel */}
			{showMarkerInfo && marker && (
				<View style={styles.markerInfoContainer}>
					<Text style={styles.markerInfoText}>
						<Text style={{ fontWeight: 'bold' }}>{marker.title}</Text>
					</Text>
					<Text style={styles.markerInfoText}>{marker.description}</Text>
					<Text style={styles.markerInfoText}>
						Szerokość: {marker.coordinate.latitude.toFixed(6)}
					</Text>
					<Text style={styles.markerInfoText}>
						Długość: {marker.coordinate.longitude.toFixed(6)}
					</Text>

					<View style={styles.actionsContainer}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={handleCloseMarkerInfo}
						>
							<Text style={styles.actionButtonText}>Zamknij</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton} onPress={handleNext}>
							<Text style={styles.actionButtonText}>Dalej</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};

export default MapScreen;
