import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import BackButton from '../../components/BackButton';
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
} from 'react-native';
import { styles } from './NewShipmentScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import imPolex from '../../assets/inPolEx.png';
import { useLocalSearchParams } from 'expo-router';

// Typ danych dla propsów
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
	const { data } = useLocalSearchParams(); // Odbiór parametru data
	let parsedData: ShipmentData | null = null;

	// Bezpieczne parsowanie danych
	try {
		parsedData = data ? JSON.parse(data as string).data : null;
	} catch (error) {
		console.error('Błąd parsowania danych:', error);
	}

	const handleBackPress = () => {
		router.replace('/DashboardScreen/DashboardScreen');
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

	if (!parsedData) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.titleText}>Brak danych do wyświetlenia</Text>
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
							<Image source={imPolex} resizeMode="contain" />
							<View style={{ width: 30, height: 30 }} />
						</View>

						<View style={styles.formContainer}>
							<Text style={styles.titleText}>Nowa przesyłka</Text>

							{/* Wyświetlenie topicName */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Nazwa tematu:</Text>
								<Text style={styles.sectionContent}>{parsedData.topicName}</Text>
							</View>

							{/* Wyświetlenie adresów */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Adresy:</Text>
								{parsedData.adresses?.length > 0 ? (
									parsedData.adresses.map((address, index) => (
										<View key={address.id} style={styles.itemContainer}>
											<Text style={styles.itemTitle}>Adres {index + 1}:</Text>
											<Text style={styles.itemText}>
												Kraj: {address.country}
											</Text>
											<Text style={styles.itemText}>
												Miasto: {address.city}
											</Text>
											<Text style={styles.itemText}>
												Ulica: {address.street}
											</Text>
											<Text style={styles.itemText}>
												Numer: {address.number}
											</Text>
											<Text style={styles.itemText}>
												Kod pocztowy: {address.postalCode}
											</Text>
											<Text style={styles.itemText}>
												Mieszkanie: {address.apartment || 'Brak'}
											</Text>
											<Text style={styles.itemText}>
												Szer. geogr.: {address.latitude.toFixed(6)}
											</Text>
											<Text style={styles.itemText}>
												Dł. geogr.: {address.longitude.toFixed(6)}
											</Text>
										</View>
									))
								) : (
									<Text style={styles.itemText}>Brak adresów</Text>
								)}
							</View>

							{/* Wyświetlenie dostępnych rozmiarów paczek */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Dostępne rozmiary paczek:</Text>
								{parsedData.availablePackageSizes?.length > 0 ? (
									parsedData.availablePackageSizes.map((pkg, index) => (
										<View key={pkg.id} style={styles.itemContainer}>
											<Text style={styles.itemTitle}>
												Paczka {index + 1}:
											</Text>
											<Text style={styles.itemText}>Rozmiar: {pkg.size}</Text>
											<Text style={styles.itemText}>
												Cena: {pkg.price} zł
											</Text>
											<Text style={styles.itemText}>
												Maks. waga: {pkg.maxWeight} kg
											</Text>
											<Text style={styles.itemText}>Wymiary:</Text>
											<Text style={styles.itemText}>
												- Szerokość: {pkg.dimensions?.width ?? 'Brak'} cm
											</Text>
											<Text style={styles.itemText}>
												- Wysokość: {pkg.dimensions?.height ?? 'Brak'} cm
											</Text>
											<Text style={styles.itemText}>
												- Głębokość: {pkg.dimensions?.depth ?? 'Brak'} cm
											</Text>
											<Text style={styles.itemText}>
												Aktywna: {pkg.active ? 'Tak' : 'Nie'}
											</Text>
											<Text style={styles.itemText}>
												Data utworzenia: {pkg.createdAt}
											</Text>
										</View>
									))
								) : (
									<Text style={styles.itemText}>Brak rozmiarów paczek</Text>
								)}
							</View>

							{/* Wyświetlenie packageId */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>ID paczki:</Text>
								<Text style={styles.sectionContent}>{parsedData.packageId}</Text>
							</View>

							{/* Wyświetlenie możliwych dostaw */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Możliwe dostawy:</Text>
								{parsedData.possibleDeliveries?.length > 0 ? (
									parsedData.possibleDeliveries.map((delivery, index) => (
										<View key={delivery.id} style={styles.itemContainer}>
											<Text style={styles.itemTitle}>
												Dostawa {index + 1}:
											</Text>
											<Text style={styles.itemText}>
												Cena: {delivery.price} zł
											</Text>
											<Text style={styles.itemText}>
												Data dostawy: {delivery.deliveryDate}
											</Text>
										</View>
									))
								) : (
									<Text style={styles.itemText}>Brak dostaw</Text>
								)}
							</View>

							{/* Wyświetlenie earliestPickupDate */}
							<View strut style={styles.section}>
								<Text style={styles.sectionTitle}>
									Najwcześniejsza data odbioru:
								</Text>
								<Text style={styles.sectionContent}>
									{new Date(parsedData.earliestPickupDate).toLocaleString(
										'pl-PL',
										{
											dateStyle: 'medium',
											timeStyle: 'short',
										},
									)}
								</Text>
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default NewShipmentScreen;
