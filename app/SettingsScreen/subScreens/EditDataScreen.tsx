import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
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
	TextInput,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { styles } from './EditDataScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Colors } from '../../../constants/theme';
import imPolex from '../../../assets/inPolEx.png';
import { postEditUser } from '../../../constants/Connections';

const EditDataScreen: React.FC = () => {
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [id, setId] = useState<string>('');

	// Load data from SecureStore on mount
	useEffect(() => {
		const loadUserData = async () => {
			try {
				const storedId = await SecureStore.getItemAsync('id');
				const storedFirstName = await SecureStore.getItemAsync('firstName');
				const storedLastName = await SecureStore.getItemAsync('lastName');
				const storedUserName = await SecureStore.getItemAsync('userName');
				const storedEmail = await SecureStore.getItemAsync('email');

				if (storedId) setId(storedId);
				if (storedFirstName) setFirstName(storedFirstName);
				if (storedLastName) setLastName(storedLastName);
				if (storedUserName) setUserName(storedUserName);
				if (storedEmail) setEmail(storedEmail);

				console.log(email);
			} catch (error) {
				console.error('Error loading data from SecureStore:', error);
			}
		};

		loadUserData();
	}, []);

	// Handle back press
	const handleBackPress = () => {
		router.replace('/SettingsScreen/SettingsScreen');
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

	// Placeholder function for save button
	const handleSaveChanges: () => void = () => {
		const payload = {
			firstName: firstName,
			lastName: lastName,
			userName: userName,
			email: email,
		};

		console.log('Save changes clicked', { firstName, lastName, userName, email });
		try {
			postEditUser(payload, Number(id));
		} catch (error) {
			console.log('Error saving changes:', error);
		}

		// TODO: Implement save logic (e.g., API call to update user data)
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
				style={styles.container}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.backButton}>
							<BackButton onPress={handleBackPress} />
							<Image source={imPolex} resizeMode="contain" />
							<View style={{ width: 30, height: 30 }} />
						</View>

						<View style={styles.formContainer}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>First Name</Text>
								<TextInput
									style={styles.input}
									value={firstName}
									onChangeText={setFirstName}
									placeholder="Enter first name"
									placeholderTextColor={Colors.grey}
									autoCapitalize="words"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Last Name</Text>
								<TextInput
									style={styles.input}
									value={lastName}
									onChangeText={setLastName}
									placeholder="Enter last name"
									placeholderTextColor={Colors.grey}
									autoCapitalize="words"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Username</Text>
								<TextInput
									style={styles.input}
									value={userName}
									onChangeText={setUserName}
									placeholder="Enter username"
									placeholderTextColor={Colors.grey}
									autoCapitalize="none"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Email</Text>
								<TextInput
									style={styles.input}
									value={email}
									onChangeText={setEmail}
									placeholder="Enter email"
									placeholderTextColor={Colors.grey}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							<TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
								<Text style={styles.buttonText}>Save Changes</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default EditDataScreen;
