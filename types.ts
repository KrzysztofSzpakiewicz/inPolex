import { TextStyle, ViewStyle, ImageStyle, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// StartScreen.tsx
export interface StylesStartScreen {
	container: ViewStyle;
	imageContainer: ImageStyle;
	image: ImageStyle;
	button: ViewStyle;
	buttons: ViewStyle;
	buttonText: TextStyle;
}

export interface StylesLoginScreen {
	container: ViewStyle;
	backButton: ViewStyle;
	titleText: TextStyle;
	textContainer: ViewStyle;
	switchButton: ViewStyle;
	button: ViewStyle;
	buttons: ViewStyle;
	buttonText: TextStyle;
	textInputsContainer: ViewStyle;
	errorContainer: ViewStyle;
	errorText: TextStyle;
}

//CreateAccountScreen.tsx
export interface StylesCreateAccountScreen {
	backButton: ViewStyle;
	container: ViewStyle;
	textInputsContainer: ViewStyle;
	textContainer: ViewStyle;
	button: ViewStyle;
	buttons: ViewStyle;
	buttonText: TextStyle;
	titleText: TextStyle;
	errorContainer: ViewStyle;
	errorText: TextStyle;
}

export type VerifyAccountParams = {
	Fname: string;
	Sname: string;
	pass: string;
};

//BackButton.tsx
export interface BackButtonTypes {
	onPress: () => void;
	buttonStyle?: ViewStyle;
}

//Button.tsx
export interface StylesButton {
	button: ViewStyle;
	text: TextStyle;
}

//TextField.tsx
export interface StylesTextField {
	container: ViewStyle;
	input: TextStyle;
	eyeIconContainer: ViewStyle;
}
export type TextFieldParamList = {
	placeholder: string;
	isPassword?: boolean;
	isEmail?: boolean;
	isCode?: boolean;
	iconName?: keyof typeof Ionicons.glyphMap;
	onTextChange: (text: string) => void;
	value?: string;
	keyboardType?: KeyboardTypeOptions;
	onFocus?: () => void;
	autoCorrect?: boolean;
	containerStyle?: ViewStyle;
	inputStyle?: TextStyle;
};

export type StateString = [string, React.Dispatch<React.SetStateAction<string>>];

export type StateBoolean = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
