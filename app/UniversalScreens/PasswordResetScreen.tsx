import React, { useEffect, useState } from 'react';
import {
	BackHandler,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { Colors } from '@/constants/theme';
import { StateString } from '@/types';
import axios, { AxiosResponse } from 'axios';
import BackButton from '@/components/BackButton';
import { styles } from '@/app/UniversalScreens/PasswordResetScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	useShowNotification,
	ShowNotificationFunction,
} from '@/components/Notification';
import { REACT_APP_API_URL } from '@env';

const PasswordResetScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const [activeOption, setActiveOption]: StateString = useState('phone');
	const [phone, setPhone]: StateString = useState<string>('+');
	const [emailTemp, setEmailTemp]: StateString = useState<string>('');

	const fromScreenType: string = 'fromResetPassword';

	const validateInputs: () => boolean = (): boolean => {
		const emailRegex: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex: RegExp =
			/^\+(\d{1,3})[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;

		if (activeOption === 'phone') {
			if (!phone.match(phoneRegex)) {
				showNotification(
					'info',
					'Info',
					'Phone number must start with + and contain 10-15 digits'
				);

				return false;
			}
		} else {
			if (!emailTemp.match(emailRegex)) {
				showNotification(
					'info',
					'Info',
					'Please enter a valid email address'
				);
				return false;
			}
		}
		return true;
	};

	// Login Button action
	const handleResetPassword: () => void = () => {
		Keyboard.dismiss();

		if (validateInputs()) {
			console.log('User details:', { phone, emailTemp });
			alert(
				`Sending data to server as JSON depending of choosen option ${phone}, ${emailTemp}`
			);
			console.log(
				`Proceeding with: ${activeOption === 'phone' ? phone : emailTemp}`
			);
			postData();
		}
	};

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload: { phoneNumber: string } | { email: string } =
				activeOption === 'phone'
					? {
							phoneNumber: phone,
						}
					: {
							email: emailTemp,
						};
			console.log('---------------');
			console.log(payload);

			const response: AxiosResponse = await axios.post(
				`${REACT_APP_API_URL}/auth/password-reset/email`, //prosba o kod na maila
				payload
			);

			//console.log('Response', response);
			console.log(response.data.message);

			const email: string = response.data.message;
			console.log(email);
			console.log('---------------');

			//navigation.navigate('VerifyCodeScreen', { email, fromScreenType });
			try {
				console.log(email);

				router.push({
					pathname: '/UniversalScreens/VerifyCodeScreen',
					params: {
						email,
						fromScreenType,
					},
				});
			} catch (error) {
				console.log('Błąd routera', error);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Check if the server response contains validation errors
				if (error.response?.data?.errors) {
					const errorMessages: string =
						error.response.data.errors.join(' '); // Join all error messages
					showNotification('error', 'Error', errorMessages);
				} else {
					console.log(error);
					// Handle other types of errors
					showNotification(
						'error',
						'Error',
						error.response?.data?.message ||
							'An unexpected error occurred.'
					);
				}
			} else {
				console.error('Unexpected error:', error);
				showNotification(
					'error',
					'Error',
					'An unexpected error occurred.'
				);
			}
		}
	};

	const handleBackPress: () => boolean = () => {
		router.push('LoginScreen/LoginScreen');
		return true;
	};

	// Add the back button listener when the component is mounted
	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		// Clean up the listener when the component unmounts
		return () => {
			BackHandler.removeEventListener(
				'hardwareBackPress',
				handleBackPress
			);
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
						<SwitchSelector
							style={styles.switchButton}
							initial={0}
							onPress={(value: string) => {
								setActiveOption(value);
							}}
							textColor={Colors.white}
							backgroundColor={Colors.backgroundColor}
							selectedColor={Colors.white}
							buttonColor={Colors.lightGrey50}
							borderColor={Colors.lightGrey50}
							bold
							height={50}
							hasPadding
							options={[
								{
									label: 'Phone Number',
									value: 'phone',
								},
								{
									label: 'E-mail',
									value: 'email',
								},
							]}
						/>
						{activeOption === 'phone' && (
							<TextField
								placeholder="Phone"
								onTextChange={setPhone}
								iconName="call"
								keyboardType="phone-pad"
								value={phone}
							/>
						)}
						{activeOption === 'email' && (
							<TextField
								autoCorrect={false}
								placeholder="E-mail"
								onTextChange={setEmailTemp}
								isEmail={true}
								iconName="mail"
								value={emailTemp}
							/>
						)}
					</View>
					<View style={styles.buttons}>
						<Button
							title="SEND CODE"
							onPress={handleResetPassword}
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
						/>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default PasswordResetScreen;
