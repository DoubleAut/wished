import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_BACKEND_API;

if (!apiURL) {
    throw new Error('There is no backend api address!!!');
}

export const fetcher = axios.create({ baseURL: apiURL });
