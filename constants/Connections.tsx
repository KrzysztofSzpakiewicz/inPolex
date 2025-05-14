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

// export const connectToStomp: (topic: string) => Promise<Client> = async (
// 	topic: string,
// ): Promise<Client> => {
// 	const token = await SecureStore.getItemAsync('token');
// 	return new Promise((resolve, reject) => {
// 		const client = new Client({
// 			brokerURL: `ws://${API_URL.replace(/^https?:\/\//, '')}/${topic}`, // Zastąp http(s) na ws
// 			connectHeaders: {
// 				Authorization: token ? `Bearer ${token}` : '',
// 			},
// 			debug: str => {
// 				console.log('STOMP Debug:', str);
// 			},
// 			reconnectDelay: 0,
// 			heartbeatIncoming: 4000,
// 			heartbeatOutgoing: 4000,
// 		});

// 		client.onConnect = frame => {
// 			console.log('Connected to STOMP:', frame);
// 			client.subscribe(`/topic/${topic}`, message => {
// 				console.log('Received STOMP message:', message.body);
// 			});
// 			resolve(client);
// 		};

// 		client.onStompError = frame => {
// 			console.error('STOMP Error:', frame);
// 			reject(new Error(`STOMP connection failed: ${frame.body}`));
// 		};

// 		client.onWebSocketError = error => {
// 			console.error('WebSocket Error:', error);
// 			reject(error);
// 		};

// 		client.activate();
// 	});
// };
