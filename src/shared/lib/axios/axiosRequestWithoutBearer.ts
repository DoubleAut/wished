import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

const axiosRequestWithoutBearer = axios.create({
    baseURL: API_URL,
});

axiosRequestWithoutBearer.interceptors.response.use(undefined, async error => {
    error.config.retries = error.config.retries || 0;

    if (error.config.retries >= 2) {
        return Promise.reject(error);
    }

    error.config.retries++;

    return axiosRequestWithoutBearer.request(error.config);
});

export default axiosRequestWithoutBearer;
