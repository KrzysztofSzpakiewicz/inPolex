// CreateAccountScreen.tsx
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import {
	View,
	Text,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
} from 'react-native';
import TextField from '../../components/TextField';
import axios, { AxiosResponse } from 'axios';
import { StateString, CreateNewPasswordParams } from '../../types';
import { styles } from './CreateNewPassword.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import { API_URL } from '@env';

const CreateNewPassword: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const params: CreateNewPasswordParams = useLocalSearchParams<CreateNewPasswordParams>();
	const { email, code }: CreateNewPasswordParams = params;
	const [pass, setPass]: StateString = useState<string>('');
	const [repeatedPass, setRepeatedPass]: StateString = useState<string>('');

	const validatePassword: (pass: string) => boolean = (pass: string) => {
		const regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!../..$%^&*-]).{8,}$/;

		if (!regex.test(pass)) {
			showNotification(
				'info',
				'Info',
				'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			);
			return false;
		}

		// Jeśli wszystkie kryteria są spełnione
		return true;
	};

	const sendPassword: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload: {
				email: string;
				code: string;
				password: string;
			} = { email: email, code: code, password: pass };
			console.log('Sending payload:', payload);
			const response: AxiosResponse = await axios.post(
				`${API_URL}/auth/password-reset`,
				payload
			);
			if (response.status === 200) {
				console.log('Password changed!');
				showNotification('success', 'Success', 'Password changed!');
			} else if (response.status === 400) {
				console.error('Incorrect verification code.');
				showNotification('error', 'Error', 'Incorrect verification code');
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
						error.response?.data?.message || 'An unexpected error occurred'
					);
				}
			} else {
				console.error('Unexpected error:', error);
				showNotification('error', 'Error', 'An unexpected error occurred');
			}
		}
	};

	const next: () => void = () => {
		Keyboard.dismiss();
		if (validatePassword(pass) || pass === repeatedPass) {
			sendPassword();
			alert(`${pass} is passed to next screen`);
			router.push('/LoginScreen/LoginScreen');
		} else {
			showNotification('error', 'Error', 'Passwords are different');
		}
	};

	const handleBackPress: () => boolean = () => {
		router.push('UniversalScreens/PasswordResetScreen');
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
						<Text style={styles.titleText}>RESET PASSWORD</Text>
					</View>
					<View style={styles.textInputsContainer}>
						<TextField
							autoCorrect={false}
							placeholder="New Password"
							isPassword
							onTextChange={setPass}
							iconName="key"
						/>
						<TextField
							autoCorrect={false}
							placeholder="Repeat Password"
							isPassword
							onTextChange={setRepeatedPass}
							iconName="key"
						/>
					</View>

					<View style={styles.buttons}>
						<Button
							title="RESET"
							onPress={next}
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
						/>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default CreateNewPassword;
