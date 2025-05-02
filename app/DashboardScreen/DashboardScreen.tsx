import React, { useEffect } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const DashboardScreen: React.FC = () => {
	const handleBackPress: () => boolean = () => {
		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Yes',
					onPress: async () => {
						try {
							// Pobierz listę kluczy z SSKeys
							const keysString: string | null =
								await SecureStore.getItemAsync('SSKeys');
							if (keysString) {
								const keys: string[] = JSON.parse(keysString);
								// Usuń wszystkie zapisane klucze
								await Promise.all(
									keys.map((key: string) => SecureStore.deleteItemAsync(key)),
								);
							}
							// Przekieruj na ekran logowania
							router.replace('/LoginScreen/LoginScreen'); // Upewnij się, że ścieżka jest poprawna
						} catch (error) {
							console.error('Error during logout:', error);
						}
					},
				},
			],
			{ cancelable: false },
		);
		return true;
	};

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		};
	}, []);

	return (
		<View>
			<Text>Dashboard</Text>
		</View>
	);
};

export default DashboardScreen;
