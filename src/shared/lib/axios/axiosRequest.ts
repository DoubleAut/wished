import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '../constants/localStorage';
import { axiosBearerInterceptor } from './axiosInterceptors';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export const axiosRequestWithBearer = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const rotateTokens = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    const rawResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    const response = (await rawResponse.json()) as {
        id: number;
        accessToken: string;
    };

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);

    return response;
};

axiosRequestWithBearer.interceptors.request.use(
    config => {
        return axiosBearerInterceptor(config);
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    },
);

axiosRequestWithBearer.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        try {
            error.config.retries = error.config.retries || 0;

            if (error.response.status === 401) {
                const token = await rotateTokens();

                error.config.headers['Authorization'] =
                    `Bearer ${token.accessToken}`;

                return await axios(error.config);
            }
        } catch (err) {
            console.error('Error refreshing token:', err);
            // const response = NextResponse.redirect(new URL(`/${lng}/signin`, req.url))
        }

        // Retry The Request
        if (error.config.retries < 3) {
            error.config.retries++;
            return axios(error.config);
        }
        // throw error
        return Promise.reject(error);
    },
);
