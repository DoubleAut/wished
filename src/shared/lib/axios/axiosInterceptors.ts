'use client';

import { InternalAxiosRequestConfig } from 'axios';
import { cookies, headers } from 'next/headers';

export const getRefreshToken = () => {
    const refreshToken = cookies().get('refreshToken');

    return refreshToken;
};

export const getAccessToken = () => {
    const accessToken = headers().get('Authorization');

    return accessToken;
};

const axiosBearerInterceptor = async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
};

export { axiosBearerInterceptor };
