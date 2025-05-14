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
import Slider from '@react-native-community/slider';
import { styles } from './EditDataScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Colors } from '../../../constants/theme';
import imPolex from '../../../assets/inPolEx.png';
import { postEditUser } from '../../../constants/Connections';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

const EditDataScreen: React.FC = () => {
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [id, setId] = useState<string>('');
	const [rotationAngle, setRotationAngle] = useState<number>(0); // Slider value (0 to 140)

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
	};

	// Render the rotating line on the canvas
	const renderRotatingLine = () => {
		const centerX = 150; // Center of the canvas
		const centerY = 150;
		const innerRadius = 40; // Inner circle radius
		const lineLength = 70; // Main line length
		const lineStartRadius = innerRadius; // Main line starts at circle's edge
		const shortLineLength = 35; // Short lines length

		// Map slider value (0 to 140) to angle (90 to 310 degrees, counterclockwise)
		const initialAngle = 90; // Start at bottom (90 degrees in Skia)
		const angleDeg = (initialAngle - rotationAngle + 360) % 360; // Decrease angle for counterclockwise rotation
		const angleRad = (angleDeg * Math.PI) / 180; // Convert to radians

		// Main line
		const innerX = centerX + lineStartRadius * Math.cos(angleRad);
		const innerY = centerY + lineStartRadius * Math.sin(angleRad);
		const outerX = centerX + (lineStartRadius + lineLength) * Math.cos(angleRad);
		const outerY = centerY + (lineStartRadius + lineLength) * Math.sin(angleRad);

		// Calculate the transition factor based on slider position (0 to 1)
		const transitionFactor = rotationAngle / 140;

		// Calculate midpoint of the main line for plus shape (starting position)
		const midPointRadius = innerRadius + lineLength / 2;
		const midPointX = centerX + midPointRadius * Math.cos(angleRad);
		const midPointY = centerY + midPointRadius * Math.sin(angleRad);

		// Calculate arrow point (ending position)
		const arrowBaseX = outerX;
		const arrowBaseY = outerY;

		// Interpolate between midpoint (plus) and end point (arrow) based on transition factor
		const baseX = midPointX * (1 - transitionFactor) + arrowBaseX * transitionFactor;
		const baseY = midPointY * (1 - transitionFactor) + arrowBaseY * transitionFactor;

		// Calculate angles for short lines
		// Start with 90 degrees (plus shape) and end with arrow angles
		const rightStartAngle = 90; // 90 degrees for plus shape
		const leftStartAngle = -90; // -90 degrees for plus shape
		const rightEndAngle = 145; // Arrow right line angle
		const leftEndAngle = 215; // Arrow left line angle

		// Interpolate angles
		const rightAngle =
			rightStartAngle * (1 - transitionFactor) + rightEndAngle * transitionFactor;
		const leftAngle = leftStartAngle * (1 - transitionFactor) + leftEndAngle * transitionFactor;

		// Calculate final angles in radians
		const rightAngleRad = (((angleDeg + rightAngle) % 360) * Math.PI) / 180;
		const leftAngleRad = (((angleDeg + leftAngle) % 360) * Math.PI) / 180;

		// Calculate end points for short lines
		const rightOuterX = baseX + shortLineLength * Math.cos(rightAngleRad);
		const rightOuterY = baseY + shortLineLength * Math.sin(rightAngleRad);
		const leftOuterX = baseX + shortLineLength * Math.cos(leftAngleRad);
		const leftOuterY = baseY + shortLineLength * Math.sin(leftAngleRad);

		// Create paths
		const mainPath = Skia.Path.Make();
		mainPath.moveTo(outerX, outerY);
		mainPath.lineTo(innerX, innerY);

		const rightPath = Skia.Path.Make();
		rightPath.moveTo(baseX, baseY);
		rightPath.lineTo(rightOuterX, rightOuterY);

		const leftPath = Skia.Path.Make();
		leftPath.moveTo(baseX, baseY);
		leftPath.lineTo(leftOuterX, leftOuterY);

		return (
			<Canvas style={{ width: 300, height: 300 }}>
				{/* Draw the inner circle */}
				<Path
					path={Skia.Path.Make().addCircle(centerX, centerY, innerRadius)}
					style="stroke"
					strokeWidth={5}
					color={Colors.red} // Match the save button color
				/>
				{/* Draw the main line */}
				<Path path={mainPath} style="stroke" strokeWidth={5} color={Colors.red} />
				{/* Draw the right short line */}
				<Path path={rightPath} style="stroke" strokeWidth={5} color={Colors.red} />
				{/* Draw the left short line */}
				<Path path={leftPath} style="stroke" strokeWidth={5} color={Colors.red} />
			</Canvas>
		);
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
							<View style={{ width: 30, height: 35 }} />
						</View>

						<View style={styles.formContainer}>
							{/* Canvas with rotating line */}
							<View style={styles.canvasContainer}>
								<Text style={styles.label}>Select Gender</Text>
								{renderRotatingLine()}
								<Slider
									style={styles.slider}
									minimumValue={0}
									maximumValue={140} // Slider range matches max rotation
									step={1}
									value={rotationAngle}
									onValueChange={setRotationAngle}
									minimumTrackTintColor={Colors.red} // Match inner circle
									maximumTrackTintColor={Colors.grey}
									thumbTintColor={Colors.primary} // Match rotating lines
								/>
							</View>

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
