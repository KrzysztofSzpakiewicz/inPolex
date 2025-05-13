import { Colors, FontSizes, FontNames } from '../../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../../constants/screenSizes';

interface StylesEditDataScreen {
	container: object;
	scrollContent: object;
	backButton: object;
	logo: object;
	titleText: object;
	formContainer: object;
	inputContainer: object;
	label: object;
	input: object;
	saveButton: object;
	buttonText: object;
}

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 30, // Extra padding to ensure save button is accessible
	},
	backButton: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		paddingHorizontal: 20,
	},
	logo: {
		width: isTablet ? 120 : 80,
		height: isTablet ? 40 : 30,
	},
	titleText: {
		fontSize: isTablet ? FontSizes.xlarge : FontSizes.large,
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginBottom: 20,
		textAlign: 'center',
	},
	formContainer: {
		width: '100%',
		paddingHorizontal: 20,
		paddingTop: 20,
		alignItems: 'center',
	},
	inputContainer: {
		width: '100%',
		marginBottom: 15,
	},
	label: {
		fontSize: FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginBottom: 5,
	},
	input: {
		width: '100%',
		backgroundColor: Colors.grey,
		borderRadius: 8,
		padding: 12,
		fontSize: FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.regular,
		borderWidth: 1,
		borderColor: Colors.red,
	},
	saveButton: {
		marginTop: 20,
		paddingVertical: 15,
		paddingHorizontal: 30,
		backgroundColor: Colors.red,
		borderRadius: 10,
		alignItems: 'center',
		width: '95%',
	},
	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
});
