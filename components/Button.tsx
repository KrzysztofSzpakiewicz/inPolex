import React, { JSX } from 'react';

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
		<TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
			<Text style={[styles.text, textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

export default Button;
