import { Colors, FontSizes, FontNames } from '../constants/theme';
import { windowWidth } from '../constants/screenSizes';
import { StylesTextField } from '../types';
import { StyleSheet } from 'react-native';

export const styles: StylesTextField = StyleSheet.create<StylesTextField>({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.darkGrey,
		width: windowWidth * 0.8,
		paddingHorizontal: 20,
		//paddingVertical: 12,
		height: 50,
		borderRadius: 30,
		shadowColor: '#000',
		shadowOffset: { width: 2, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		marginVertical: 15,
		borderWidth: 3,
		borderColor: Colors.red,
	},
	input: {
		flex: 1,
		fontSize: FontSizes.small,
		color: Colors.darkWhite,
		fontFamily: FontNames.medium,
		marginLeft: 10,
	},
	eyeIconContainer: {
		marginLeft: 10,
	},
});
