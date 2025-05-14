import * as SecureStore from 'expo-secure-store';
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
	TouchableOpacity,
} from 'react-native';
import { styles } from './EditAdressesScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import imPolex from '../../../assets/inPolEx.png';
import incomming from '../../../assets/incomming.png';
import { getAddresses } from '../../../constants/Connections';
import { Image } from 'react-native';
import { AxiosResponse } from 'axios';
import { Colors } from '../../../constants/theme';

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

const EditAddressesScreen: React.FC = () => {
	const [addresses, setAddresses] = useState<Address[]>([]);

	const handleBackPress: () => boolean = () => {
		router.replace('/SettingsScreen/SettingsScreen');
		return true;
	};

	const handleMoveToMap: () => void = () => {
		router.replace('/SettingsScreen/subScreens/MapScreen');
	};

	const handleDeleteAddress = (addressId: number) => {
		// Pusta metoda do usuwania adresu - do zaimplementowania w przyszłości
	};

	const handleEditAddress = (address: Address) => {
		router.push({
			pathname: '/SettingsScreen/subScreens/EditSingleAddressScreen',
			params: { address: JSON.stringify(address) },
		});
	};

	useEffect(() => {
		const subscription: NativeEventSubscription = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress,
		);

		const fetchAddresses = async () => {
			try {
				const response: AxiosResponse<Address[]> = await getAddresses();
				setAddresses(response.data);
			} catch (error) {
				console.error('Error fetching addresses:', error);
			}
		};

		fetchAddresses();

		return () => {
			subscription.remove();
		};
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.container}
				>
					<View style={styles.backButton}>
						<BackButton onPress={handleBackPress}></BackButton>
						<Image source={imPolex} resizeMode="contain" />
						<View style={{ width: 30, height: 30 }}></View>
					</View>

					<View style={styles.buttons}>
						<TouchableOpacity onPress={() => handleMoveToMap()} style={styles.button}>
							<Image source={incomming} resizeMode="contain" />
							<Text style={styles.text}>Add New Address</Text>
						</TouchableOpacity>
						<Text style={styles.text}>Your Addresses:</Text>
						{addresses.map(address => (
							<TouchableOpacity
								key={address.id}
								onPress={() => handleEditAddress(address)}
								style={styles.addressContainer}
							>
								<View style={styles.addressTextContainer}>
									<Text style={styles.addressText}>
										{address.city}, {address.street} {address.number}
									</Text>
									<Text style={styles.addressText}>{address.postalCode}</Text>
								</View>
								<TouchableOpacity
									onPress={() => handleDeleteAddress(address.id)}
									style={styles.deleteButton}
								>
									<Icon name="delete" size={24} color={Colors.red} />
								</TouchableOpacity>
							</TouchableOpacity>
						))}
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default EditAddressesScreen;
