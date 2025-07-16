import fontRegular from '../assets/fonts/Montserrat-Regular.ttf';
import fontMedium from '../assets/fonts/Montserrat-Medium.ttf';
import fontSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf';
import fontBold from '../assets/fonts/Montserrat-Bold.ttf';
import { VariantsMap, NotificationsConfig } from 'react-native-notificated/lib/typescript/types';

export const Colors: { [key: string]: string } = {
	lightGray: '#2C2B2B',
	darkGrey: '#232323',
	navyLight: '#656768',
	light: '#D9D9D9',
	red: '#BB0033',
	darkWhite: '#F2F4F3',
};

export const FontSizes: { [key: string]: number } = {
	small: 20,
	medium: 24,
	large: 36,
};

// Define font names as constants to avoid typos
export const FontNames: {
	regular: 'Montserrat-Regular';
	medium: 'Montserrat-Medium';
	semiBold: 'Montserrat-SemiBold';
	bold: 'Montserrat-Bold';
} = {
	regular: 'Montserrat-Regular',
	medium: 'Montserrat-Medium',
	semiBold: 'Montserrat-SemiBold',
	bold: 'Montserrat-Bold',
} as const;

// Export font files with type annotations
export const Fonts: {
	[key in (typeof FontNames)[keyof typeof FontNames]]: string;
} = {
	[FontNames.regular]: fontRegular,
	[FontNames.medium]: fontMedium,
	[FontNames.semiBold]: fontSemiBold,
	[FontNames.bold]: fontBold,
};

export const NotificationConfig: Partial<NotificationsConfig<VariantsMap>> = {
	isNotch: true,
	duration: 2000,
	defaultStylesSettings: {
		darkMode: true,
		globalConfig: {
			multiline: 5,
			bgColor: Colors.lightGray,
			accentColor: Colors.red,
		},
	},
};
