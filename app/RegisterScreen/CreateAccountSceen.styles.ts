import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { StylesCreateAccountScreen } from '../../types';
import { windowHeight, windowWidth, isTablet } from '../../constants/screenSizes';

export const styles: StylesCreateAccountScreen = StyleSheet.create<StylesCreateAccountScreen>({
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
		flex: 1,
		justifyContent: 'flex-start',
		marginTop: windowHeight * 0.06,
	},
	textInputsContainer: {
		marginTop: windowHeight * -0.1,
		flex: 1,
		justifyContent: 'center',
	},
	button: {
		marginTop: windowHeight * 0.17,
		width: windowWidth * 0.5,
		maxWidth: 550,
		marginVertical: isTablet ? windowHeight * 0.01 : windowHeight * 0.01,
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
