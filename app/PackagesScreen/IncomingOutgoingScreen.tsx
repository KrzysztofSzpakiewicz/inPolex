import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from './IncomingOutgoingScreen.styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import incomming from '../../assets/incomming.png';
import outgoing from '../../assets/outgoing.png';
import { getUserPackages } from '../../constants/Connections';

// Define the package interface
interface Package {
	id: number;
	createdAt: string;
	plannedDeliveryDate: string;
	price: number;
	packageSize: { size: string };
	sender: { firstName: string; lastName: string; id: number };
	receiver: { firstName: string; lastName: string; id: number };
	senderAddress: {
		city: string;
		street: string;
		number: string;
		postalCode: string;
		country: string;
	};
	receiverAddress: {
		city: string;
		street: string;
		number: string;
		postalCode: string;
		country: string;
	};
	packageStatus: string | null;
}

// Define the props type explicitly
interface IncomingOutgoingScreenProps {
	route?: { params?: { mode?: string } };
}

const IncomingOutgoingScreen: React.FC<IncomingOutgoingScreenProps> = ({ route }) => {
	const mode = route?.params?.mode || 'incoming';
	const [packages, setPackages] = useState<Package[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const userId = await SecureStore.getItemAsync('id');
				const userInt = Number(userId);
				if (!userId) {
					console.error('No user ID found in SecureStore');
					setPackages([]);
					return;
				}
				const fetchedPackages = await getUserPackages(
					userInt,
					mode === 'incoming' ? 'DELIVERED' : 'IN_TRANSIT',
				);
				// Filter packages based on mode and user ID
				const filteredPackages = fetchedPackages.filter((pkg: Package) =>
					mode === 'incoming' ? pkg.receiver.id === userInt : pkg.sender.id === userInt,
				);
				setPackages(filteredPackages);
			} catch (error) {
				console.error('Failed to fetch packages:', error);
				setPackages([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [mode]);

	const handleBackPress = () => {
		router.back();
		return true;
	};

	// Format date for display (e.g., "2025-06-23T10:24:31.175365" -> "Jun 23, 2025")
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const renderPackage = ({ item }: { item: Package }) => (
		<TouchableOpacity
			style={styles.packageItem}
			onPress={() => alert(`Package ID: ${item.id} clicked`)}
		>
			<Image source={mode === 'incoming' ? incomming : outgoing} style={styles.packageIcon} />
			<View style={styles.packageDetails}>
				<Text style={styles.packageTitle}>Package ID: {item.id}</Text>
				<Text style={styles.packageText}>Status: {item.packageStatus || 'Unknown'}</Text>
				<Text style={styles.packageText}>Size: {item.packageSize.size}</Text>
				<Text style={styles.packageText}>Price: ${item.price.toFixed(2)}</Text>
				<Text style={styles.packageText}>Created: {formatDate(item.createdAt)}</Text>
				<Text style={styles.packageText}>
					Delivery: {formatDate(item.plannedDeliveryDate)}
				</Text>
				<Text style={styles.packageText}>
					Sender: {item.sender.firstName} {item.sender.lastName}
				</Text>
				<Text style={styles.packageText}>
					From: {item.senderAddress.city}, {item.senderAddress.country}
				</Text>
				<Text style={styles.packageText}>
					Receiver: {item.receiver.firstName} {item.receiver.lastName}
				</Text>
				<Text style={styles.packageText}>
					To: {item.receiverAddress.city}, {item.receiverAddress.country}
				</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Icon
					name="arrow-back"
					size={30}
					color={styles.titleText.color}
					onPress={handleBackPress}
				/>
				<Text style={styles.title}>
					{mode === 'incoming' ? 'Incoming Shipments' : 'Outgoing Shipments'}
				</Text>
				<View style={{ width: 30 }} />
			</View>
			{loading ? (
				<Text style={styles.loadingText}>Loading...</Text>
			) : packages.length === 0 ? (
				<Text style={styles.loadingText}>No packages found</Text>
			) : (
				<FlatList
					data={packages}
					renderItem={renderPackage}
					keyExtractor={item => item.id.toString()}
					style={styles.list}
				/>
			)}
		</SafeAreaView>
	);
};

export default IncomingOutgoingScreen;
