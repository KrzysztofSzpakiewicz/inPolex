import { StyleSheet } from 'react-native';
import { Colors, FontSizes, FontNames } from '../../../constants/theme';
import { isTablet } from '../../../constants/screenSizes';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
	},
	backButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		paddingHorizontal: 20,
	},
	titleText: {
		fontSize: isTablet ? FontSizes.xlarge : FontSizes.large,
		color: Colors.light,
		fontFamily: FontNames.bold,
		textAlign: 'center',
		flex: 1,
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
		marginBottom: 20,
	},
	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
});
