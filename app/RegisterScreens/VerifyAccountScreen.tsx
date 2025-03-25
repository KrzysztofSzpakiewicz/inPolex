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
import { StateString, VerifyAccountParams } from '../../types';
import { styles } from './VerifyAccountScreen.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postRegisterUser, sendVerificationEmail } from '../../constants/Connections';

const VerifyAccountScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const params: VerifyAccountParams = useLocalSearchParams<VerifyAccountParams>();
	const { Fname, Sname, pass }: VerifyAccountParams = params;
	const [email, setEmail]: StateString = useState<string>('');
	const [phone, setPhone]: StateString = useState<string>('+');

	const validateInputs: () => boolean = (): boolean => {
		const emailRegex: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phonewithCountryRegex: RegExp =
			/^\+(\d{1,3})[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{3})$/;
		const phonewithoutCountryRegex: RegExp = /^\+[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{3})$/;
		if (!email.match(emailRegex)) {
			showNotification('warning', 'Warning', 'Please enter a valid email address');
			return false;
		}

		if (phone.match(phonewithoutCountryRegex)) {
			setPhone(`+48${phone.slice(1)}`);
		}

		if (!phone.match(phonewithCountryRegex)) {
			console.log(phone);
			showNotification(
				'warning',
				'Warning',
				'Phone number must start with + and contain 10-15 digits'
			);
			return false;
		}

		return true;
	};

	const handlePhoneChange: (input: string) => void = (input: string) => {
		if (input === '' || input === '+') {
			setPhone('+');
		} else {
			const formattedPhone: string = '+' + input.replace(/[^\d]/g, '');
			setPhone(formattedPhone);
		}
	};

	const formatPhoneForSubmission: (phone: string) => string = (phone: string) => {
		return phone.replace(/[^\d]/g, '');
	};

	const next: () => void = () => {
		Keyboard.dismiss();

		if (validateInputs()) {
			console.log('Verification details:', { email, phone });
			// alert(
			// 	`Sending data to server as JSON ${Fname}, ${Sname}, ${pass}, ${email}, ${phone}`
			// );
			postData();
		}
	};

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload: {
				phoneNumber: string;
				firstName: string;
				lastName: string;
				email: string;
				password: string;
			} = {
				phoneNumber: formatPhoneForSubmission(phone),
				firstName: Fname,
				lastName: Sname,
				email: email,
				password: pass,
			};

			console.log('Sending payload:', payload);

			const registerResponse: AxiosResponse = await postRegisterUser(payload);

			console.log('Response:', registerResponse.data);
			// If registration is successful, send the verification email request
			const verificationPayload: { email: string } = { email: email }; // Make sure it's an object

			console.log('Sending verification email payload:', verificationPayload);

			// Second request: Send email verification request
			const verifyResponse: AxiosResponse = await sendVerificationEmail(verificationPayload);

			console.log('Verification Email Response:', verifyResponse.data);
			// Navigate to the next screen on successful response
			const fromScreenType: string = 'fromRegisterScreen';
			router.push({
				pathname: '/UniversalScreens/VerifyCodeScreen',
				params: {
					email,
					fromScreenType,
				},
			});
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
				showNotification('error', 'Error', 'An unexpected error occurred k.');
			}
		}
	};

	const handleBackPress: () => boolean = () => {
		router.push('/RegisterScreens/CreateAccountScreen');
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
						<Text style={styles.titleText}>VERIFY ACCOUNT</Text>
					</View>
					<View style={styles.textInputsContainer}>
						<TextField
							autoCorrect={false}
							placeholder="Email"
							value={email}
							isEmail={true}
							onTextChange={(text: string) =>
								setEmail(text.trim().replace(/\s+/g, ''))
							}
							iconName="mail"
						/>
						<TextField
							placeholder="Phone"
							value={phone}
							onTextChange={handlePhoneChange}
							iconName="call"
							keyboardType="phone-pad"
						/>
					</View>
					<View style={styles.buttons}>
						<Button
							title="NEXT"
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

export default VerifyAccountScreen;
