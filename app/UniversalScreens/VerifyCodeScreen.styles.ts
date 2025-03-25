import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { StylesVerifyCodeScreen } from '../../types';
import {
	windowHeight,
	windowWidth,
	isTablet,
} from '../../constants/screenSizes';

export const styles: StylesVerifyCodeScreen =
	StyleSheet.create<StylesVerifyCodeScreen>({
		container: {
			flex: 1,
			backgroundColor: Colors.backgroundColor,
			alignItems: 'center',
		},
		backButton: {
			flexDirection: 'row',
			width: windowWidth,

			justifyContent: 'flex-start', // Align the back button to the left
			alignItems: 'center',
			paddingTop: 10,
			paddingHorizontal: 20,
		},
		titleText: {
			fontSize: FontSizes.large,
			color: Colors.white,
			fontFamily: FontNames.bold,
		},
		textContainer: {
			flex: 2,
			justifyContent: 'flex-end',
		},
		textInputsContainer: {
			flex: 1,
			justifyContent: 'flex-end',
		},
		resendContainer: {
			flex: 0.5,
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
		},
		buttons: {
			flex: 1,
			justifyContent: 'flex-start',
			width: '100%',
		},
		button: {
			width: windowWidth * 0.5,
			maxWidth: 550,
			marginVertical: isTablet
				? windowHeight * 0.01
				: windowHeight * 0.01,
		},
		buttonText: {
			fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		},
		errorContainer: {
			position: 'absolute',
			width: windowWidth * 0.95,
			padding: 20,
			marginTop: isTablet ? windowHeight * 0.1 : windowHeight * 0.08,
			marginHorizontal: 10,
			backgroundColor: Colors.darkGrey,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 30,
		},
		errorText: {
			color: Colors.lightGrey50,
			fontSize: FontSizes.small,
			fontFamily: FontNames.bold,
		},
		resendText: {
			color: Colors.lightGrey50, // Adjust color as needed
			fontSize: FontSizes.medium,
			fontFamily: FontNames.regular,
		},
	});
