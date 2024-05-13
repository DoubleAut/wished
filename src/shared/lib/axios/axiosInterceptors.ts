import { InternalAxiosRequestConfig } from 'axios';

export const getAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken');

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
