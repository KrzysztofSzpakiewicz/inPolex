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
	Alert,
	TouchableOpacity,
} from 'react-native';
import { styles } from './NewShipmentScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import imPolex from '../../assets/inPolEx.png';
import { Image } from 'react-native';

const NewShipmentScreen: React.FC = () => {
	const handleSettingsPress: () => void = () => {};

	const handleBackPress: () => boolean = () => {
		router.replace('/DashboardScreen/DashboardScreen');

		return true;
	};

	const handleNavigation: (screen: string) => void = (screen: string) => {
		router.push(`/${screen}`);
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
						<Text style={styles.buttonText}>New Shipment Screen</Text>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default NewShipmentScreen;
