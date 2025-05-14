import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	backButton: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		paddingHorizontal: 20,
	},
	scrollContainer: {
		padding: 20,
		paddingBottom: 40,
	},
	titleText: {
		fontSize: FontSizes.large,
		color: Colors.light,
		fontFamily: FontNames.bold,
		textAlign: 'center',
		marginVertical: 20,
	},
	section: {
		marginVertical: 10,
		width: '100%',
	},
	sectionTitle: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginBottom: 8,
	},
	sectionContent: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginLeft: 10,
	},
	itemContainer: {
		backgroundColor: Colors.grey,
		borderRadius: 8,
		padding: 12,
		marginVertical: 6,
	},
	itemTitle: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginBottom: 6,
	},
	itemText: {
		fontSize: isTablet ? FontSizes.small : FontSizes.xsmall,
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginLeft: 10,
		marginVertical: 2,
	},
});
