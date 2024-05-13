import { InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_KEY } from '../constants/localStorage';

export const getAccessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

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
