import { Dimensions } from 'react-native';

export const windowWidth: number = Dimensions.get('window').width;
export const windowHeight: number = Dimensions.get('window').height;
export const isTablet: boolean = windowWidth > 768;

export type ScreenSizes = {
	windowWidth: number;
	windowHeight: number;
	isTablet: boolean;
};

export const screenSizes: ScreenSizes = {
	windowWidth,
	windowHeight,
	isTablet,
};
