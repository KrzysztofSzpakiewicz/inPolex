import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import {
	View,
	Text,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import TextField from '../../components/TextField';
import axios, { AxiosResponse } from 'axios';
import { StateString, StateBoolean, StateNumber, VerifyCodeParams } from '../../types';
import { styles } from './VerifyCodeScreen.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import { API_URL } from '@env';

const VerifyCodeScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const params: VerifyCodeParams = useLocalSearchParams<VerifyCodeParams>();
	const { email, fromScreenType }: VerifyCodeParams = params;
	const [code, setCode]: StateString = useState('');
	const [timerSeconds, setTimerSeconds]: StateNumber = useState(0);
	const [isButtonDisabled, setIsButtonDisabled]: StateBoolean = useState(true);
	const timerIntervalRef: React.MutableRefObject<NodeJS.Timeout | null> =
		useRef<NodeJS.Timeout | null>(null);

	const verifyCode: () => Promise<void> = async (): Promise<void> => {
		console.log(email);

		try {
			const payload: {
				email: string;
				code: string;
			} = {
				email: email,
				code: code,
			};

			console.log('Sending payload:', payload);
			const response: AxiosResponse =
				fromScreenType === 'fromResetPassword'
					? await axios.post(`${API_URL}/auth/password-reset/code`, payload)
					: await axios.post(`${API_URL}/auth/verification`, payload);
			if (response.status === 200) {
				console.log('Account verified successfully!');
				showNotification('success', 'Success', 'Verified successfully!');
				if (fromScreenType === 'fromRegisterScreen') {
					router.dismissAll();
					router.push('/LoginScreen/LoginScreen');
				} else if (fromScreenType === 'fromLoginScreen') {
					//nawiguj do ekranu home
				} else if (fromScreenType === 'fromResetPassword') {
					try {
						router.push({
							pathname: '/UniversalScreens/CreateNewPassword',
							params: {
								email,
								code,
							},
						});
					} catch (error) {
						console.log('Błąd routera', error);
					}
				} else {
					//...
				}
			} else if (response.status === 400) {
				console.error('Incorrect verification code.');
				showNotification('warning', 'Warning', 'Incorrect verification code');
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
						error.response?.data?.message || 'An unexpected error occurred',
					);
				}
			} else {
				console.error('Unexpected error:', error);
				showNotification('error', 'Error', 'An unexpected error occurred');
			}
		}
	};

	const next: () => void = () => {
		console.log('email', email);

		Keyboard.dismiss();
		verifyCode();

		console.log(code);
	};

	const startTimer: () => void = () => {
		setIsButtonDisabled(true); // Disable button initially
		setTimerSeconds(0); // Start from 0

		timerIntervalRef.current = setInterval(() => {
			setTimerSeconds((prevSeconds: number) => {
				if (prevSeconds >= 30) {
					clearInterval(timerIntervalRef.current!); // Stop the timer
					setIsButtonDisabled(false); // Enable button after 30 seconds
					return 30;
				}
				return prevSeconds + 1;
			});
		}, 1000); // Update every second
	};

	useEffect(() => {
		startTimer();
		showNotification('info', 'Info', 'Verification code was sent to your email');
		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
		// eslint-disable-next-line
	}, []);

	const resendCode: () => Promise<void> = async (): Promise<void> => {
		console.log(email);

		try {
			const payload: {
				email: string;
			} = {
				email: email,
			};

			const response: AxiosResponse =
				fromScreenType === 'fromResetPassword'
					? await axios.post(`${API_URL}/auth/password-reset/email`, payload)
					: await axios.post(`${API_URL}/auth/verification/email`, payload);

			if (response.status === 200) {
				console.log('Verification code sent.');
				showNotification('info', 'Info', 'Sent new verification code');
			}
			startTimer(); // Restart the timer after resending the code
		} catch (error) {
			console.error('Error resending code:', error);
			showNotification('error', 'Error', 'Failed to resend verification code');
		}
	};

	const formatTime: (seconds: number) => string = (seconds: number) => {
		const minutes: number = Math.floor(seconds / 60);
		const remainingSeconds: number = seconds % 60;

		// Use String.padStart to ensure two digits
		const formattedMinutes: string = String(minutes).padStart(2, '0');
		const formattedSeconds: string = String(remainingSeconds).padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	const renderResendButton: () => React.JSX.Element = () => {
		return (
			<View style={styles.resendContainer}>
				<TouchableOpacity
					onPress={resendCode}
					disabled={isButtonDisabled} // Disable the button if true
				>
					<Text style={styles.resendText}>
						{isButtonDisabled
							? `Resend in ${formatTime(30 - timerSeconds)}`
							: 'Resend code'}
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const handleBackPress: () => void = () => {
		router.back();
	};

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
						<Text style={styles.titleText}>VERIFY</Text>
					</View>
					<View style={styles.textInputsContainer}>
						<TextField
							placeholder="Code"
							onTextChange={setCode}
							iconName="checkmark-circle"
							autoCorrect={false}
						/>
					</View>
					{renderResendButton()}
					<View style={styles.buttons}>
						<Button
							title="VERIFY"
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

export default VerifyCodeScreen;
