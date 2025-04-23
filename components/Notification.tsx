import { createNotifications } from 'react-native-notificated';
import { NotificationConfig } from '../constants/theme';
import {
	Notify,
	CreateNotificationsReturnType,
	VariantsMap,
	Variants,
} from 'react-native-notificated/lib/typescript/types';

export const {
	useNotifications,
	NotificationsProvider,
}: {
	useNotifications: CreateNotificationsReturnType<VariantsMap>['useNotifications'];
	NotificationsProvider: CreateNotificationsReturnType<VariantsMap>['NotificationsProvider'];
} = createNotifications(NotificationConfig);

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export type ShowNotificationFunction = (
	type: NotificationType,
	title: string,
	description: string,
) => void;

type UseShowNotificationReturn = {
	showNotification: ShowNotificationFunction;
};

export const useShowNotification: () => UseShowNotificationReturn = () => {
	const { notify }: { notify: Notify<Variants> } = useNotifications();

	const showNotification: ShowNotificationFunction = (
		type: NotificationType,
		title: string,
		description: string,
	): void => {
		notify(type, {
			params: {
				description,
				title,
				style: {
					defaultIconType: 'monochromatic',
				},
			},
			config: {
				duration: Math.max(3000, description.length * 100),
			},
		});
	};

	return { showNotification };
};
