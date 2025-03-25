import React from 'react';

// import { Colors, FontSizes, FontNames } from '@/constants/theme';

import { TouchableOpacity, Text } from 'react-native';
import { ButtonParamList } from '@/types';
import { styles } from '@/components/Button.styles';

const Button: React.FC<ButtonParamList> = ({
	title,
	onPress,
	buttonStyle,
	textStyle,
}: ButtonParamList): JSX.Element => {
	return (
		<TouchableOpacity
			style={[styles.button, buttonStyle]}
			onPress={onPress}
		>
			<Text style={[styles.text, textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

// Styles for the CustomButton
// const styles: ButtonStyles = StyleSheet.create({
// 	button: {
// 		backgroundColor: Colors.lightGrey50,
// 		width: windowWidth / 2,
// 		paddingHorizontal: 20,
// 		paddingVertical: 12,
// 		borderRadius: 30,
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		elevation: 3, // Elevation for Android
// 		shadowColor: '#000', // Shadow for iOS
// 		shadowOffset: { width: 0, height: 4 },
// 		shadowOpacity: 0.5,
// 		shadowRadius: 3,
// 	},
// 	text: {
// 		color: Colors.white, // Default text color
// 		fontSize: FontSizes.medium, // Default text size
// 		fontFamily: FontNames.bold, // Bold text
// 		shadowOffset: { width: 0, height: 4 },
// 		shadowOpacity: 0.2,
// 		shadowRadius: 3,
// 	},
// });

export default Button;
