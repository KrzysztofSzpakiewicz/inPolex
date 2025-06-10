import React, { useEffect, useState } from 'react';
import {
	BackHandler,
	Keyboard,
	KeyboardAvoidingView,
	NativeEventSubscription,
	Platform,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
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
	const [email, setEmail]: StateString = useState<string>('');
	const [password, setPassword]: StateString = useState<string>('');

	const validateInputs: () => boolean = (): boolean => {
		const emailRegex: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
		const passwordRegex: RegExp =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

		// if (!email.match(emailRegex)) {
		// 	showNotification('warning', 'Warning', 'Wrong email address');

		// 	return false;
		// }
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
			alert(`Sending data to server as JSON ${email}, ${password}`);
			postData();
		}
	};

	// function decodeJWT(token: string) {
	// 	const base64Url: string = token.split('.')[1]; // Get the payload part
	// 	const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix padding
	// 	const jsonPayload: string = decodeURIComponent(
	// 		atob(base64)
	// 			.split('')
	// 			.map((c: string) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
	// 			.join(''),
	// 	);

	// 	return JSON.parse(jsonPayload); // Parse as JSON
	// }

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload: { email: string; password: string } = {
				email: email,
				password: password,
			};

			const response: AxiosResponse = await postLoginUser(payload);
			//console.log('Response', response.data);
			if (response.data.verified === false) {
				const verificationPayload: { email: string } = { email: email };

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
				console.log(response.data);
				try {
					const keys = [
						'token',
						'firstName',
						'lastName',
						'id',
						'mode',
						'email',
						'userName',
						'role',
						'SSKeys',
					];

					// Ensure all values are strings
					const dataToStore = {
						SSKeys: JSON.stringify(keys),
						token: String(response.data.token),
						firstName: String(response.data.firstName),
						lastName: String(response.data.lastName),
						id: String(response.data.id),
						role: String(response.data.role),
						email: String(response.data.email),
						mode: 'USER',
						userName: String(response.data.userName), // Note: userName vs. username in log
					};

					// Save each key-value pair to SecureStore
					for (const [key, value] of Object.entries(dataToStore)) {
						await SecureStore.setItemAsync(key, value);
					}

					console.log('Token saved successfully', response.data.token);
				} catch (error) {
					console.error('Error saving token:', error);
				}

				router.replace('/DashboardScreen/DashboardScreen');
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
						error.response?.data?.message || 'An unexpected error occurred.',
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
		// Add event listener and store the subscription
		const subscription: NativeEventSubscription = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress,
		);

		// Cleanup: Call remove() on the subscription
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
