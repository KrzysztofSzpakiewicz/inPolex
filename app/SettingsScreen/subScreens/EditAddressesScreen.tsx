import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
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
	Alert,
	TouchableOpacity,
} from 'react-native';
import { styles } from './EditAdressesScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import imPolex from '../../../assets/inPolEx.png';
import incomming from '../../../assets/incomming.png';
import outgoing from '../../../assets/outgoing.png';
import newPackage from '../../../assets/newPackage.png';

import { Image } from 'react-native';

const EditAddressesScreen: React.FC = () => {
	const handleBackPress: () => boolean = () => {
		router.replace('/SettingsScreen/SettingsScreen');

		return true;
	};
	const handleMoveToMap: () => void = () => {
		router.replace('/SettingsScreen/subScreens/MapScreen');
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
						{/* <Icon
                            name="settings"
                            size={30}
                            color={styles.titleText.color}
                            onPress={handleSettingsPress}
                        /> */}
						<View style={{ width: 30, height: 30 }}></View>
					</View>

					<View style={styles.buttons}>
						<TouchableOpacity onPress={() => handleMoveToMap()} style={styles.button}>
							<Image source={incomming} resizeMode="contain" />
							<Text style={styles.text}>Add New Address</Text>
						</TouchableOpacity>
						<Text style={styles.text}> Your Addresses:</Text>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default EditAddressesScreen;
