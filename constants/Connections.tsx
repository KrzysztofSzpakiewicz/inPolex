import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { Client, CompatClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useState } from 'react';
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
interface EditUserPayload {
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
}

interface AddAddressPayload {
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	apartment: string;
	latitude: number;
	longitude: number;
}

interface EditAddressPayload {
	country: string;
	city: string;
	street: string;
	number: string;
	postalCode: string;
	apartment: string;
	latitude: number;
	longitude: number;
}

interface RegisterVerificationPayload {
	email: string;
}

export const postLoginUser: (payload: LoginPayload) => Promise<AxiosResponse> = async (
	payload: LoginPayload,
): Promise<AxiosResponse> => {
	console.log('sent to ', API_URL);
	return await axios.post(`${API_URL}/auth/login`, payload);
};

export const sendUserVerification: (
	payload: LoginVerificationPayload,
) => Promise<AxiosResponse> = async (payload: LoginVerificationPayload): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/verification/email`, payload);
};

export const postRegisterUser: (payload: RegisterPayload) => Promise<AxiosResponse> = async (
	payload: RegisterPayload,
): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/register`, payload);
};

export const postEditUser: (
	payload: EditUserPayload,
	id: number,
) => Promise<AxiosResponse> = async (
	payload: EditUserPayload,
	id: number,
): Promise<AxiosResponse> => {
	console.log('EditUser', payload);
	console.log('Sending', `${API_URL}/user/${id}`);

	const token = await SecureStore.getItemAsync('token');
	return await axios.put(`${API_URL}/user/${id}`, payload, {
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	});
};

export const postAddAddress: (payload: AddAddressPayload) => Promise<AxiosResponse> = async (
	payload: AddAddressPayload,
): Promise<AxiosResponse> => {
	console.log('Sending', `${API_URL}/address`);
	console.log('Payload', payload);

	const token = await SecureStore.getItemAsync('token');
	return await axios.post(`${API_URL}/address`, payload, {
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	});
};

export const getAddresses: () => Promise<AxiosResponse> = async (): Promise<AxiosResponse> => {
	const token = await SecureStore.getItemAsync('token');
	const id = await SecureStore.getItemAsync('id');
	console.log('Sending', `${API_URL}/address/user/${id}`);
	return await axios.get(`${API_URL}/address/user/${id}`, {
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	});
};

export const putSingleAddress: (
	payload: EditAddressPayload,
	id: number,
) => Promise<AxiosResponse> = async (
	payload: EditAddressPayload,
	id: number,
): Promise<AxiosResponse> => {
	console.log('Sending', `${API_URL}/address`);
	console.log('Payload', payload);

	const token = await SecureStore.getItemAsync('token');
	return await axios.put(`${API_URL}/address/${id}`, payload, {
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	});
};

export const postNewPackage: () => Promise<AxiosResponse> = async (): Promise<AxiosResponse> => {
	const token = await SecureStore.getItemAsync('token');
	return await axios.post(
		`${API_URL}/package`,
		{},
		{
			headers: {
				Authorization: token ? `Bearer ${token}` : undefined,
			},
		},
	);
};

export const sendVerificationEmail: (
	payload: RegisterVerificationPayload,
) => Promise<AxiosResponse> = async (
	payload: RegisterVerificationPayload,
): Promise<AxiosResponse> => {
	return await axios.post(`${API_URL}/auth/verification/email`, payload);
};

export const searchUserByUsername = async (userName: string): Promise<AxiosResponse> => {
	const token = await SecureStore.getItemAsync('token');
	console.log('Searching user with username:', userName);
	console.log('Sending request to:', `${API_URL}/user/adresses?field=userName&query=${userName}`);

	return await axios.get(`${API_URL}/user/adresses?field=userName&query=${userName}`, {
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	});
};
