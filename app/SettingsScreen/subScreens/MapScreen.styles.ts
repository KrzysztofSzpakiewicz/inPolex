import { Colors, FontSizes, FontNames } from '../../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../../constants/screenSizes';

interface StylesMapScreen {
	container: object;
	backButton: object;
	logo: object;
	titleText: object;
	mapContainer: object;
	map: object;
	formContainer: object;
	inputContainer: object;
	label: object;
	input: object;
	confirmButton: object;
	saveButton: object;
	buttonText: object;
	header: object;
	logoImage: object;
	markerInfoContainer: object;
	markerInfoText: object;
	actionsContainer: object;
	actionButton: object;
	actionButtonText: object;
}

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.darkGrey,
	},
	backButton: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		paddingHorizontal: 20,
		backgroundColor: Colors.darkGrey,
		zIndex: 1,
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
	mapContainer: {
		flex: 1,
		width: '100%',
		position: 'absolute',
		top: 60, // Space for header
		bottom: 0,
		left: 0,
		right: 0,
	},
	map: {
		width: '100%',
		height: '100%', // Full height of container
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.grey,
	},
	formContainer: {
		flex: 1,
		width: '100%',
		paddingHorizontal: 20,
		paddingTop: 20,
		alignItems: 'center',
	},
	inputContainer: {
		width: '100%',
		marginBottom: 20,
		backgroundColor: Colors.grey,
		borderRadius: 12,
		padding: 15,
		borderWidth: 1,
		borderColor: Colors.red,
	},
	label: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.regular,
		marginBottom: 5,
	},
	input: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.regular,
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: Colors.red,
		marginBottom: 10,
	},
	confirmButton: {
		paddingVertical: 15,
		paddingHorizontal: 30,
		backgroundColor: Colors.red,
		borderRadius: 12,
		alignItems: 'center',
		width: '95%',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	saveButton: {
		paddingVertical: 15,
		paddingHorizontal: 30,
		backgroundColor: Colors.red,
		borderRadius: 12,
		alignItems: 'center',
		width: '95%',
		marginTop: 20,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		backgroundColor: Colors.darkGrey,
		zIndex: 10,
		paddingTop: 10,
		paddingBottom: 10,
	},
	logoImage: {
		width: isTablet ? 120 : 80,
		height: isTablet ? 40 : 30,
	},
	markerInfoContainer: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		backgroundColor: Colors.grey,
		borderRadius: 12,
		padding: 15,
		borderWidth: 1,
		borderColor: Colors.red,
		zIndex: 5,
	},
	markerInfoText: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: '#000000', // Changed to black
		fontFamily: FontNames.regular,
		marginBottom: 10,
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: 10,
	},
	actionButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		backgroundColor: Colors.red,
		borderRadius: 12,
		alignItems: 'center',
		width: '48%',
	},
	actionButtonText: {
		fontSize: isTablet ? FontSizes.medium : FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.bold,
	},
});
