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
	NativeEventSubscription,
} from 'react-native';
import TextField from '../../components/TextField';
import { StateString } from '../../types';
import { styles } from './CreateAccountSceen.styles';
import { router } from 'expo-router';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios, { AxiosResponse } from 'axios';
import { postRegisterUser, sendVerificationEmail } from '../../constants/Connections';

const CreateAccountScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	const [Fname, setFname]: StateString = useState<string>('');
	const [Sname, setSname]: StateString = useState<string>('');
	const [username, setUsername]: StateString = useState<string>('');
	const [pass, setPass]: StateString = useState<string>('');
	const [email, setEmail]: StateString = useState<string>('');
	const [phone, setPhone]: StateString = useState<string>('');

	const validatePassword: (pass: string) => boolean = (pass: string) => {
		//const regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!..$%^&*-]).{8,}$/;

		// if (!regex.test(pass)) {
		// 	showNotification(
		// 		'warning',
		// 		'Warning',
		// 		'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		// 	);

		// 	return false;
		// }

		// Jeśli wszystkie kryteria są spełnione
		return true;
	};

	const validateInputs: () => boolean = (): boolean => {
		// Trim leading and trailing spaces and capitalize names
		const trimmedFname: string = Fname.trim();
		const trimmedSname: string = Sname.trim();
		const capitalizedFname: string =
			trimmedFname.charAt(0).toUpperCase() + trimmedFname.slice(1);
		const capitalizedSname: string =
			trimmedSname.charAt(0).toUpperCase() + trimmedSname.slice(1);

		setFname(capitalizedFname);
		setSname(capitalizedSname);

		// Regular expression to allow only letters (including Polish characters) for the first name
		const nameRegex: RegExp = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
		// Regular expression to allow letters, Polish characters, spaces, and hyphens in the last name,
		// but no hyphen or space at the start or end, and no consecutive hyphens or spaces.
		const surnameRegex: RegExp =
			/^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+([ -][A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)*$/;

		// Validate first name
		if (!nameRegex.test(capitalizedFname)) {
			showNotification('info', 'Info', 'First name format is not correct');
			return false;
		}

		// Validate last name
		if (!surnameRegex.test(capitalizedSname)) {
			showNotification('info', 'Info', 'Last name format is not correct');
			return false;
		}

		const emailRegex: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phonewithoutCountryRegex: RegExp = new RegExp('^[0-9]{9}$');

		if (!email.match(emailRegex)) {
			showNotification('warning', 'Warning', 'Please enter a valid email address');
			return false;
		}

		if (!phone.match(phonewithoutCountryRegex)) {
			console.log(phone);
			showNotification('warning', 'Warning', 'Invalid phone number!');
			return false;
		}

		// Validate password
		return validatePassword(pass);
	};

	const formatPhoneForSubmission: (phone: string) => string = (phone: string) => {
		return phone.replace(/[^\d]/g, '');
	};

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			const payload: {
				phoneNumber: string;
				firstName: string;
				userName: string;
				lastName: string;
				email: string;
				password: string;
			} = {
				phoneNumber: formatPhoneForSubmission(phone),
				firstName: Fname,
				lastName: Sname,
				userName: username,
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
						error.response?.data?.message || 'An unexpected error occurred.',
					);
				}
			} else {
				console.error('Unexpected error:', error);
				showNotification('error', 'Error', 'An unexpected error occurred k.');
			}
		}
	};

	const handleBackPress: () => boolean = () => {
		router.push('/');
		return true;
	};

	const next: () => void = () => {
		Keyboard.dismiss();

		//if (validateInputs()) {
		console.log('Verification details:', { email, phone });
		// alert(
		// 	`Sending data to server as JSON ${Fname}, ${Sname}, ${pass}, ${email}, ${phone}`
		// );
		postData();
		//}
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
						<Text style={styles.titleText}>CREATE ACCOUNT</Text>
					</View>
					<View style={styles.textInputsContainer}>
						<TextField
							autoCorrect={false}
							placeholder="Name"
							onTextChange={(text: string) =>
								setFname(text.trim().replace(/\s+/g, ''))
							}
						/>
						<TextField
							autoCorrect={false}
							placeholder="Last Name"
							onTextChange={(text: string) =>
								setSname(text.trim().replace(/\s+/g, ''))
							}
						/>
						<TextField
							autoCorrect={false}
							placeholder="Username"
							onTextChange={(text: string) =>
								setUsername(text.trim().replace(/\s+/g, ''))
							}
						/>
						<TextField
							placeholder="Phone Number"
							value={phone}
							onTextChange={setPhone}
							iconName="call"
							keyboardType="phone-pad"
						/>
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
							autoCorrect={false}
							placeholder="Password"
							isPassword
							onTextChange={setPass}
							iconName="key"
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

export default CreateAccountScreen;
