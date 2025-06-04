import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
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
	Alert,
	TouchableOpacity,
} from 'react-native';
import { styles } from './SettingsScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import imPolex from '../../assets/inPolEx.png';
import incomming from '../../assets/incomming.png';
import outgoing from '../../assets/outgoing.png';
import newPackage from '../../assets/newPackage.png';
import { Image } from 'react-native';

const SettingsScreen: React.FC = () => {
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const storedRole = await SecureStore.getItemAsync('role');
				setRole(storedRole);
			} catch (error) {
				console.error('Error fetching role from SecureStore:', error);
			}
		};

		fetchRole();
	}, []);

	const handleEditAccountDataPress: () => void = () => {
		router.replace('/SettingsScreen/subScreens/EditDataScreen');
	};

	const handleEditAddressesPress: () => void = () => {
		router.replace('/SettingsScreen/subScreens/EditAddressesScreen');
	};

	const handleLogOutPress: () => void = () => {
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
							const keysString: string | null =
								await SecureStore.getItemAsync('SSKeys');
							if (keysString) {
								const keys: string[] = JSON.parse(keysString);
								await Promise.all(
									keys.map((key: string) => SecureStore.deleteItemAsync(key)),
								);
							}
							router.replace('/LoginScreen/LoginScreen');
						} catch (error) {
							console.error('Error during logout:', error);
						}
					},
				},
			],
			{ cancelable: false },
		);
	};

	const handleChangePasswordPress: () => void = () => {
		alert('not implemented');
	};

	const handleChangeModePress: () => void = () => {
		alert('Change Mode not implemented');
	};

	const handleBackPress: () => boolean = () => {
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
						<TouchableOpacity
							onPress={() => handleEditAccountDataPress()}
							style={styles.button}
						>
							<Image source={incomming} resizeMode="contain" />
							<Text style={styles.text}>Edit Account Data</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleEditAddressesPress()}
							style={styles.button}
						>
							<Image source={outgoing} resizeMode="contain" />
							<Text style={styles.text}>Edit Addresses</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleChangePasswordPress()}
							style={styles.button}
						>
							<Image source={outgoing} resizeMode="contain" />
							<Text style={styles.text}>Change Password</Text>
						</TouchableOpacity>
						{role && role !== 'ROLE_USER' && (
							<TouchableOpacity
								onPress={() => handleChangeModePress()}
								style={styles.button}
							>
								<Image source={newPackage} resizeMode="contain" />
								<Text style={styles.text}>Change Mode</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={() => handleLogOutPress()} style={styles.button}>
							<Image source={outgoing} resizeMode="contain" />
							<Text style={styles.text}>Log Out</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default SettingsScreen;
