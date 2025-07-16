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
		<StripeProvider publishableKey="pk_test_51RYBLPBOkUVkmTR49uvpaBU43kVvoXjHrPu8TqhlpHR7COVIHyeIXaA1ctRn7sJ7jFgZSkGuhHlzA55jwWwKFHgC00T0i1auuW">
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
