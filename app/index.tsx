import React, { useCallback, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';
import logo from '../assets/logo.png';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { Colors, FontNames, Fonts, FontSizes } from '../constants/theme';
import { windowHeight, windowWidth, isTablet } from '../constants/screenSizes';
import { StateBoolean, StylesStartScreen } from '../types';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const StartScreen: React.FC = () => {
	const [appIsReady, setAppIsReady]: StateBoolean = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				// eslint-disable-next-line @typescript-eslint/typedef
				const fontAssets = {
					[FontNames.regular]: Fonts[FontNames.regular],
					[FontNames.medium]: Fonts[FontNames.medium],
					[FontNames.semiBold]: Fonts[FontNames.semiBold],
					[FontNames.bold]: Fonts[FontNames.bold],
				};
				await Font.loadAsync(fontAssets);
			} catch (e) {
				console.warn('Error loading fonts:', e);
			} finally {
				setAppIsReady(true);
				setTimeout(() => SplashScreen.hideAsync(), 5000); // Hide splash screen after 5 seconds
			}
		}

		async function checkLongToken() {
			const token: string | null = await SecureStore.getItemAsync('token');
			if (token) {
				router.push('/DashboardScreen/DashboardScreen');
				console.log('Token found');
			} else {
				console.log('No token found');
			}
		}

		async function initializeApp() {
			// Ensure `prepare` completes before running `checkLongToken`
			await prepare();
			checkLongToken();
		}

		initializeApp();
	}, []);

	const onLayoutRootView: () => Promise<void> = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return <LoadingFonts />;
	}

	const handleLoginPress: () => void = () => {
		console.log('redirected');
		router.push('/LoginScreen/LoginScreen');
	};
	const handleRegisterPress: () => void = () => {
		console.log('redirected');
		router.push('/RegisterScreen/CreateAccountScreen');
	};

	return (
		<View style={styles.container} onLayout={onLayoutRootView}>
			<View style={styles.imageContainer}>
				<Image source={logo} style={styles.image} resizeMode="contain" />
			</View>
			<View style={styles.buttons}>
				<Button
					title="LOG IN"
					onPress={handleLoginPress}
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
				/>
				<Button
					title="REGISTER"
					onPress={handleRegisterPress}
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
				/>
			</View>
		</View>
	);
};

const LoadingFonts: React.FC = () => {
	return (
		<View style={[styles.container]}>
			<ActivityIndicator size={'large'} />
			<Text>Loading fonts...</Text>
		</View>
	);
};

const styles: StylesStartScreen = StyleSheet.create<StylesStartScreen>({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
		alignItems: 'center',
	},
	imageContainer: { flex: 2, justifyContent: 'center' },
	image: {
		width: windowWidth * 0.6,
		height: windowHeight * 0.3,
	},
	button: {
		width: windowWidth * 0.8,
		maxWidth: 550,
		marginVertical: isTablet ? windowHeight * 0.01 : windowHeight * 0.01,
	},
	buttons: { flex: 1, justifyContent: 'center' },
	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
	},
});

export default StartScreen;
