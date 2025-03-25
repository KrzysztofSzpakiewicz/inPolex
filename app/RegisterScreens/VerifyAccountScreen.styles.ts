import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { StylesVerifyAccountScreen } from '../../types';
import {
	windowWidth,
	windowHeight,
	isTablet,
} from '../../constants/screenSizes';

export const styles: StylesVerifyAccountScreen =
	StyleSheet.create<StylesVerifyAccountScreen>({
		container: {
			flex: 1,
			backgroundColor: Colors.backgroundColor,
			alignItems: 'center',
			justifyContent: 'space-between',
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
			flex: 1,
			justifyContent: 'flex-end',
		},
		textInputsContainer: {
			marginTop: 50,
			flex: 1,
			justifyContent: 'center',
		},
		button: {
			marginTop: 60,
			width: windowWidth * 0.5,
			maxWidth: 550,
			marginVertical: isTablet
				? windowHeight * 0.01
				: windowHeight * 0.01,
		},
		buttons: {
			flex: 1,
			justifyContent: 'flex-start',
			width: '100%',
			alignItems: 'center',
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
	});
