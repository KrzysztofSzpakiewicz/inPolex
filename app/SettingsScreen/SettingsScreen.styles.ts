import { Colors, FontSizes, FontNames } from '../../constants/theme';
import { StyleSheet } from 'react-native';
import { windowWidth, windowHeight, isTablet } from '../../constants/screenSizes';

interface StylesSettingsScreen {
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
		//alignItems: 'center',
		//justifyContent: 'space-between',
	},
	backButton: {
		flexDirection: 'row',
		width: windowWidth,
		justifyContent: 'space-between', // Rozmieszcza elementy równomiernie: lewo, środek, prawo
		alignItems: 'center',
		paddingTop: 10,
		paddingHorizontal: 20,
	},
	text: {
		paddingLeft: 5,
		fontSize: FontSizes.small,
		color: Colors.light,
		fontFamily: FontNames.bold,
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
		//justifyContent: 'flex-start',
		width: '100%',
		marginLeft: 2,
		marginTop: 10,
	},
	button: {
		margin: 10,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 5,
		borderColor: Colors.red,
		borderWidth: 4,
		borderRadius: 10,
		width: '95%',
		alignItems: 'center',
		flexDirection: 'row',
	},

	buttonText: {
		fontSize: isTablet ? FontSizes.large : FontSizes.medium,
		color: Colors.light,
		marginLeft: 10,
	},
});
