import React, { JSX } from 'react';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BackButtonTypes } from '../types';

const BackButton: React.FC<BackButtonTypes> = ({
	onPress,
	buttonStyle,
}: BackButtonTypes): JSX.Element => {
	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<Ionicons name={'chevron-back-outline'} size={40} color={Colors.light} />
		</TouchableOpacity>
	);
};

export default BackButton;
