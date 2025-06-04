import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
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
	Alert,
	TouchableOpacity,
} from 'react-native';
import { styles } from './DashboardScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import imPolex from '../../assets/inPolEx.png';
import incomming from '../../assets/incomming.png';
import outgoing from '../../assets/outgoing.png';
import newPackage from '../../assets/newPackage.png';
import { useShowNotification, ShowNotificationFunction } from '../../components/Notification';
import axios, { AxiosResponse } from 'axios';
import { postNewPackage, sendVerificationEmail } from '../../constants/Connections';

import { Image } from 'react-native';
import { StateString } from '@/types';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const DashboardScreen: React.FC = () => {
	const { showNotification }: { showNotification: ShowNotificationFunction } =
		useShowNotification();
	let userId: string | null = null;
	let userInt: number = 0;
	const [stompClient, setStompClient] = useState<CompatClient | null>(null);
	let response: AxiosResponse;
	const [topicName, setTopicName]: StateString = useState<string>('');

	const handleSettingsPress: () => void = () => {
		router.push({
			pathname: '/SettingsScreen/SettingsScreen',
		});
	};
	const handleNewPackagePress: () => Promise<void> = async () => {
		try {
			// Wykonaj zapytanie POST
			await postData();

			userId = await SecureStore.getItemAsync('id');
			userInt = Number(userId);

			await connectToWs();
			const data = JSON.stringify(response);
			// Przenieś użytkownika tylko, jeśli POST się powiedzie
			router.push({
				pathname: '/NewShipmentScreen/NewShipmentScreen',
				params: { data },
			});
		} catch (error) {
			// Błędy są obsługiwane w postData, więc tutaj nie robimy nic dodatkowego
			console.log('Post failed, navigation prevented.');
		}
	};

	const connectToWs: () => void = (): void => {
		const socket: WebSocket = new SockJS('http://89.66.26.232:8080/ws');
		const client: CompatClient = Stomp.over(socket);

		client.debug = () => {};

		client.connect(
			{ userId: userInt },
			() => {
				setStompClient(client);

				connectedToWs(client);
			},
			(error: string) => {
				console.error('WebSocket connection error:', error);
				setTimeout(() => connectToWs(), 3000); // Retry after 3 seconds
			},
		);
	};

	const connectedToWs: (client: CompatClient) => void = (client: CompatClient) => {
		if (client) {
			//package data do zmiany na tipicname
			client.subscribe(`/topic/package-data`, messageRecivedFromWs);
		} else {
			console.error('STOMP client is not initialized properly.');
		}
	};

	const messageRecivedFromWs: (payload: { body: string }) => void = (payload: {
		body: string;
	}) => {
		console.log(payload.body);

		//const receivedMessage = JSON.parse(payload.body);
	};

	const postData: () => Promise<void> = async (): Promise<void> => {
		try {
			console.log('Sending requrest');

			response = await postNewPackage();
			setTopicName(response.data.topicName);
			console.log('Response:', response.data.topicName);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.data?.errors) {
					const errorMessages: string = error.response.data.errors.join(' ');
					showNotification('error', 'Error', errorMessages);
				} else {
					console.log(error.response?.data?.message);

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
			// Rzuć błąd, aby zatrzymać nawigację w handleNewPackagePress
			throw error;
		}
	};

	const handleIncommingShipmentsPress: () => void = () => {
		alert('Incomming Shipments no route');
	};

	const handleOutgoingShipmentsPress: () => void = () => {
		alert('Outgoing Shipments no route');
	};
	const handleBackPress: () => boolean = () => {
		alert('Event detected - no action');
		return true;
	};

	const handleNavigation: (screen: string) => void = (screen: string) => {
		router.push(`/${screen}`);
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

	return (
		<SafeAreaView style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.container}
				>
					<View style={styles.backButton}>
						<View style={{ width: 30, height: 30 }}></View>
						<Image source={imPolex} resizeMode="contain" />
						<Icon
							name="settings"
							size={30}
							color={styles.titleText.color}
							onPress={handleSettingsPress}
						/>
					</View>

					<View style={styles.buttons}>
						<TouchableOpacity
							onPress={() => handleIncommingShipmentsPress()}
							style={styles.button}
						>
							<Image source={incomming} resizeMode="contain" />
							<Text style={styles.text}>Incomming Shipments</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleOutgoingShipmentsPress()}
							style={styles.button}
						>
							<Image source={outgoing} resizeMode="contain" />
							<Text style={styles.text}>Outgoing Shipments</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleNewPackagePress()}
							style={styles.button}
						>
							<Image source={newPackage} resizeMode="contain" />
							<Text style={styles.text}>New Shipment</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default DashboardScreen;
