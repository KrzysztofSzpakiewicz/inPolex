import { StyleSheet } from 'react-native';
import { Colors, FontNames, FontSizes } from '../../constants/theme';
import { StylesLoginScreen } from '../../types';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

export const styles: StylesLoginScreen = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
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
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
	textContainer: {
		flex: 0.5,
		justifyContent: 'flex-end',
		marginBottom: 40,
	},
	switchButton: {
		marginVertical: 15,
	},
	textInputsContainer: {
		flex: 0.8,
		justifyContent: 'center',
		marginBottom: 30,
	},
	button: {
		width: windowWidth * 0.5,
		maxWidth: 550,
		marginVertical: isTablet ? windowHeight * 0.01 : windowHeight * 0.01,
	},
	buttons: {
		flex: 0.5,
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
		color: Colors.navyLight,
		fontSize: FontSizes.small,
		fontFamily: FontNames.bold,
	},
});
