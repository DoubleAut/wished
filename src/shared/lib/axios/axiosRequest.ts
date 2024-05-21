import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '../constants/localStorage';
import { axiosBearerInterceptor } from './axiosInterceptors';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export const axiosRequestWithBearer = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

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
                const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

                const newResponse = await axiosRequestWithBearer.get(
                    `${API_URL}/auth/refresh`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                if (newResponse.status > 400 && error.config.retries > 3) {
                    throw new Error(`HTTP error! status: ${error.status}`);
                }

                localStorage.setItem(
                    ACCESS_TOKEN_KEY,
                    newResponse.data.accessToken,
                );

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
