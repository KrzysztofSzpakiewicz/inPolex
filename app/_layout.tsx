import { Stack } from 'expo-router';
import React, { JSX } from 'react';
import { createNotifications } from 'react-native-notificated';
import { NotificationConfig } from '../constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
	CreateNotificationsReturnType,
	VariantsMap,
} from 'react-native-notificated/lib/typescript/types';
import { StripeProvider } from '@stripe/stripe-react-native'; // Import StripeProvider

export const {
	useNotifications,
	NotificationsProvider,
}: {
	useNotifications: CreateNotificationsReturnType<VariantsMap>['useNotifications'];
	NotificationsProvider: CreateNotificationsReturnType<VariantsMap>['NotificationsProvider'];
} = createNotifications(NotificationConfig);

export default function RootLayout(): JSX.Element {
	return (
		<StripeProvider publishableKey="pk_test_51RWCy7R6MsN6InsOPFr4PEaMcqr6wveiKGnKA2vx1pPhDUcS1BqjopNClB4jMySfK9HJqmoihcfheiCszn2tRQz400pw6Du4yi">
			<GestureHandlerRootView>
				<>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen
							name="index"
							options={{
								gestureEnabled: false,
							}}
						/>
					</Stack>
					<NotificationsProvider />
				</>
			</GestureHandlerRootView>
		</StripeProvider>
	);
}
