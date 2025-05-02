import { Colors } from '../constants/theme';
import { FontSizes } from '../constants/theme';
import { FontNames } from '../constants/theme';
import { windowWidth } from '../constants/screenSizes';
import { StylesButton } from '../types';
import { StyleSheet } from 'react-native';

export const styles: StylesButton = StyleSheet.create<StylesButton>({
	button: {
		backgroundColor: Colors.red,
		width: windowWidth / 2,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3, // Elevation for Android
		shadowColor: '#000', // Shadow for iOS
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
	text: {
		color: Colors.light,
		fontSize: FontSizes.medium,
		fontFamily: FontNames.bold,
		fontWeight: 'bold',
	},
});
