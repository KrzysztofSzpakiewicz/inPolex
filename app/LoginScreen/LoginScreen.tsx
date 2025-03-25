import React, { useEffect, useState } from 'react';
import {
	BackHandler,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { Colors, FontNames } from '../../constants/theme';
import { StateString } from '../../types';
import axios, { AxiosResponse } from 'axios';
import BackButton from '../../components/BackButton';
import { styles } from './LoginScreen.styles';
import { router } from 'expo-router';
//import { showNotification } from '@/components/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import * as SecureStore from 'expo-secure-store';
import { postLoginUser, sendUserVerification } from '../../constants/Connections';

const LoginScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const [activeOption, setActiveOption]: StateString = useState<string>('phone');
	const [phone, setPhone]: StateString = useState<string>('+');
	const [email, setEmail]: StateString = useState<string>('');
	const [password, setPassword]: StateString = useState<string>('');

	const validateInputs: () => boolean = (): boolean => {
		const emailRegex: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex: RegExp = /^\+(\d{1,3})[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
		const passwordRegex: RegExp =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

		if (activeOption === 'phone') {
			if (!phone.match(phoneRegex)) {
				showNotification('warning', 'Warning', 'Wrong phone number');
				return false;
			}
		} else {
			if (!email.match(emailRegex)) {
				showNotification('warning', 'Warning', 'Wrong email address');

				return false;
			}
		}
		if (!password.match(passwordRegex)) {
			showNotification('warning', 'Warning', 'Wrong password');
			return false;
		}
		return true;
	};

	// Login Button action
	const handleLogIn: () => void = () => {
		Keyboard.dismiss();
		if (validateInputs()) {
			//console.log('User details:', { phone, email, password });
			alert(
				`Sending data to server as JSON depending of choosen option ${phone}, ${email}, ${password}`
			);
			postData();
		}
	};

	function decodeJWT(token: string) {
		const base64Url: string = token.split('.')[1]; // Get the payload part
		const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix padding
		const jsonPayload: string = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c: string) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
				.join('')
		);

		return JSON.parse(jsonPayload); // Parse as JSON
	}
	const formatPhoneForSubmission: (phone: string) => string = (phone: string) => {
		return phone.replace(/[^\d]/g, '');
	};

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload:
				| { phoneNumber: string; password: string }
				| { email: string; password: string } =
				activeOption === 'phone'
					? {
							phoneNumber: formatPhoneForSubmission(phone),
							password: password,
						}
					: {
							email: email,
							password: password,
						};

			const response: AxiosResponse = await postLoginUser(payload);
			//console.log('Response', response.data);
			if (response.data.verified === false) {
				const verificationPayload: { phoneNumber: string } | { email: string } =
					activeOption === 'email' ? { email: email } : { phoneNumber: phone };

				console.log('Sending verification email payload:', verificationPayload);

				// Second request: Send email verification request
				const verifyResponse: AxiosResponse =
					await sendUserVerification(verificationPayload);
				console.log('Verification Email Response:', verifyResponse.data);
				const fromScreenType: string = 'fromLoginScreen';
				router.push({
					pathname: '/UniversalScreens/VerifyCodeScreen',
					params: {
						email,
						fromScreenType,
					},
				});
			} else {
				try {
					const keys: string[] = [
						'long_user_token',
						'firstName',
						'lastName',
						'SSKeys',
						'phoneNumber',
					];

					await SecureStore.setItemAsync('SSKeys', JSON.stringify(keys));

					await SecureStore.setItemAsync('long_user_token', response.data.accessToken);
					await SecureStore.setItemAsync('firstName', response.data.firstName);

					await SecureStore.setItemAsync('lastName', response.data.lastName);

					// Decode the token and extract the 'sub'
					const decodedPayload: {
						sub: '48502871468';
						iat: 1736705924;
						exp: 1737310724;
					} = decodeJWT(response.data.accessToken);
					const sub: string = decodedPayload.sub;

					await SecureStore.setItemAsync('phoneNumber', sub);

					console.log('Token saved successfully');
				} catch (error) {
					console.error('Error saving token:', error);
				}
				// TODO: PODMIENIC
				// router.replace('/CommunicatorScreens/HomeScreen');
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Check if the server response contains validation errors
				if (error.response?.data?.errors) {
					const errorMessages: string = error.response.data.errors.join(' '); // Join all error messages
					showNotification('error', 'Error', errorMessages);
				} else {
					// Handle other types of errors
					showNotification(
						'error',
						'Error',
						error.response?.data?.message || 'An unexpected error occurred.'
					);
				}
			} else {
				console.error('Unexpected error:', error);
				showNotification('error', 'Error', 'An unexpected error occurred.');
			}
		}
	};

	// Resset Password screen button
	const goToRessetPasswordScreen: () => void = () => {
		Keyboard.dismiss();
		router.push('/UniversalScreens/PasswordResetScreen');
	};
	const handleBackPress: () => boolean = () => {
		router.push('/');
		return true;
	};

	// Add the back button listener when the component is mounted
	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		// Clean up the listener when the component unmounts
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
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
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.titleText}>LOG IN</Text>
					</View>
					<View style={styles.textInputsContainer}>
						<TextField
							autoCorrect={false}
							placeholder="E-mail"
							onTextChange={setEmail}
							isEmail={true}
							iconName="mail"
							value={email}
						/>
						<TextField
							autoCorrect={false}
							placeholder="Password"
							isPassword
							onTextChange={setPassword}
						/>
					</View>
					<View style={styles.buttons}>
						<Button
							title="LOG IN"
							onPress={handleLogIn}
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
						/>
						<TouchableOpacity onPress={goToRessetPasswordScreen}>
							<Text
								style={{
									color: Colors.navyLight,
									fontFamily: FontNames.regular,
									fontSize: 20,
								}}
							>
								Reset Password
							</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default LoginScreen;
