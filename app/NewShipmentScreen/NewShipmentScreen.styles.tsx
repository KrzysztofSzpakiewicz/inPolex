import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

interface StylesNewShipmentScreen {
	container: object;
	backButton: object;
	titleText: object;
	textContainer: object;
	buttons: object;
	button: object;
	buttonText: object;
}

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
		justifyContent: 'space-between', // Rozmieszcza elementy równomiernie: lewo, środek, prawo
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
		justifyContent: 'flex-end',
	},
	buttons: {
		flex: 1,
		justifyContent: 'flex-start',
		width: '100%',
		alignItems: 'center',
	},

	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		marginLeft: 10,
	},
});
