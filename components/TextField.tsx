// TextField.tsx
import React, { useState, FC } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { TextFieldParamList } from '../types';
import { styles } from '../components/TextField.styles';

const TextField: FC<TextFieldParamList> = ({
	placeholder,
	isPassword = false,
	isEmail = false,
	isCode = false,
	autoCorrect = false,
	iconName = 'person',
	onTextChange,
	value = '',
	keyboardType = 'default',
	onFocus,
	containerStyle,
	inputStyle,
}: TextFieldParamList): JSX.Element => {
	const [text, setText]: [string, React.Dispatch<React.SetStateAction<string>>] =
		useState<string>(value);

	const [isSecureText, setIsSecureText]: [
		boolean,
		React.Dispatch<React.SetStateAction<boolean>>,
	] = useState<boolean>(isPassword);

	const handleTextChange: (input: string) => void = (input: string): void => {
		setText(input);
		onTextChange(input);
	};

	const togglePasswordVisibility: () => void = (): void => {
		setIsSecureText(!isSecureText);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			<Ionicons name={iconName} size={24} color={Colors.darkWhite} />
			<TextInput
				style={[styles.input, inputStyle]}
				value={text}
				placeholder={placeholder}
				placeholderTextColor={Colors.navyLight}
				secureTextEntry={isSecureText}
				keyboardType={keyboardType}
				maxLength={isCode ? 6 : undefined}
				onChangeText={handleTextChange}
				onFocus={onFocus}
				autoCapitalize={isEmail ? 'none' : 'sentences'}
				autoCorrect={autoCorrect ? true : false} // Disable autocorrect
			/>
			{isPassword && (
				<TouchableOpacity
					onPress={togglePasswordVisibility}
					style={styles.eyeIconContainer}
				>
					<Ionicons
						name={isSecureText ? 'eye-off' : 'eye'}
						size={24}
						color={Colors.darkWhite}
					/>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default TextField;
