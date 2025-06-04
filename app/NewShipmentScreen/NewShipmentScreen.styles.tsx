import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

interface StylesNewShipmentScreen {
	container: object;
	scrollContent: object;
	backButton: object;
	logo: object;
	titleText: object;
	formContainer: object;
	searchContainer: object;
	input: object;
	label: object;
	selector: object;
	searchButton: object;
	buttonText: object;
	section: object;
	sectionTitle: object;
	sectionContent: object;
	itemContainer: object;
	itemTitle: object;
	itemText: object;
	packageItemContainer: object;
	selectedPackageItem: object;
}

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 40, // Increased padding for better spacing
	},
	backButton: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 15, // Slightly more padding for better alignment
		paddingHorizontal: 20,
		backgroundColor: Colors.darkGrey, // Consistent background
	},
	logo: {
		width: isTablet ? 140 : 100, // Slightly larger logo for better visibility
		height: isTablet ? 50 : 40,
		resizeMode: 'contain', // Ensure logo scales properly
	},
	titleText: {
		fontSize: isTablet ? FontSizes.xxlarge : FontSizes.xlarge, // Larger for better hierarchy
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginVertical: 25, // More vertical space
		textAlign: 'center',
	},
	formContainer: {
		width: '100%',
		paddingHorizontal: 20,
		paddingTop: 25,
		alignItems: 'center',
	},
	searchContainer: {
		width: '100%',
		marginBottom: 25, // Increased margin for better separation
		backgroundColor: Colors.grey, // Subtle background for search section
		borderRadius: 12, // Softer corners
		padding: 15, // Added padding for better spacing
		elevation: 2, // Subtle shadow for depth (Android)
		shadowColor: '#000', // iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	input: {
		width: '100%',
		backgroundColor: Colors.darkGrey, // Darker input background for contrast
		borderRadius: 10,
		padding: 14,
		fontSize: FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.regular,
		borderWidth: 1,
		borderColor: Colors.lightGrey, // Lighter grey for better contrast
		marginBottom: 12,
	},
	label: {
		fontSize: FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.medium, // Slightly bolder for emphasis
		marginBottom: 8,
	},
	selector: {
		width: '100%',
		backgroundColor: Colors.darkGrey, // Consistent with input
		borderRadius: 10,
		padding: 14,
		fontSize: FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.regular,
		borderWidth: 1,
		borderColor: Colors.lightGrey,
		marginBottom: 12,
	},
	searchButton: {
		paddingVertical: 16, // Slightly taller button
		paddingHorizontal: 30,
		backgroundColor: Colors.red, // Vibrant button color
		borderRadius: 12, // Softer corners
		alignItems: 'center',
		width: '100%',
		elevation: 3, // Subtle shadow for button (Android)
		shadowColor: '#000', // iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	buttonText: {
		fontSize: isTablet ? FontSizes.xlarge : FontSizes.large, // Larger text for better readability
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
	section: {
		marginVertical: 15, // Increased spacing between sections
		width: '100%',
		backgroundColor: Colors.grey,
		borderRadius: 12, // Softer corners
		padding: 16, // More padding for comfort
		borderWidth: 1,
		borderColor: Colors.lightGrey, // Lighter grey for contrast
		elevation: 2, // Subtle shadow for depth
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	sectionTitle: {
		fontSize: isTablet ? FontSizes.xlarge : FontSizes.large, // Larger for better hierarchy
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginBottom: 10,
	},
	sectionContent: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium, // Larger for readability
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginLeft: 12,
	},
	itemContainer: {
		backgroundColor: Colors.darkGrey, // Consistent dark background
		borderRadius: 10,
		padding: 14, // More padding for comfort
		marginVertical: 8,
		borderWidth: 1,
		borderColor: Colors.lightGrey, // Lighter grey for contrast
		elevation: 1, // Subtle shadow
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	itemTitle: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium, // Larger for hierarchy
		color: Colors.light,
		fontFamily: FontNames.bold,
		marginBottom: 8,
	},
	itemText: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small, // Larger for readability
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginLeft: 12,
		marginVertical: 3, // Slightly more spacing between lines
	},
	packageItemContainer: {
		backgroundColor: Colors.darkGrey,
		borderRadius: 10,
		padding: 14,
		marginVertical: 8,
		borderWidth: 1,
		borderColor: Colors.lightGrey,
		elevation: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	selectedPackageItem: {
		borderColor: Colors.red, // Retained red border for selected items
		borderWidth: 2, // Slightly thicker for emphasis
	},
});
