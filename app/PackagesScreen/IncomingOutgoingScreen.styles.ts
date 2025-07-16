import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
	},
	header: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.red,
	},
	titleText: {
		fontSize: FontSizes.large,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
	list: {
		padding: 10,
	},
	packageItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderWidth: 2,
		borderColor: Colors.red,
		borderRadius: 10,
		marginBottom: 10,
	},
	packageIcon: {
		width: 30,
		height: 30,
		marginRight: 10,
	},
	packageText: {
		fontSize: FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
	loadingText: {
		color: Colors.light,
		fontSize: FontSizes.medium,
		textAlign: 'center',
		marginTop: 20,
	},
});
