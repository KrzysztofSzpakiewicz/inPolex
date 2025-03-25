import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

interface LoginPayload {
	phoneNumber?: string;
	email?: string;
	password: string;
}

interface LoginVerificationPayload {
	phoneNumber?: string;
	email?: string;
}

interface RegisterPayload {
	phoneNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface RegisterVerificationPayload {
	email: string;
}

export const postLoginUser: (payload: LoginPayload) => Promise<AxiosResponse> = async (
	payload: LoginPayload
): Promise<AxiosResponse> => {
	console.log('sent to ', process.env.API_URL);
	return await axios.post(`${API_URL}/auth/login`, payload);
};

export const sendUserVerification: (
	payload: LoginVerificationPayload
) => Promise<AxiosResponse> = async (payload: LoginVerificationPayload): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/verification/email`, payload);
};

export const postRegisterUser: (payload: RegisterPayload) => Promise<AxiosResponse> = async (
	payload: RegisterPayload
): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/register`, payload);
};

export const sendVerificationEmail: (
	payload: RegisterVerificationPayload
) => Promise<AxiosResponse> = async (
	payload: RegisterVerificationPayload
): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/verification/email`, payload);
};
