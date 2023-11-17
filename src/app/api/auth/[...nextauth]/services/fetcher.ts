import axios from 'axios';

const apiURL = process.env.BACKEND_API;

if (!apiURL) {
    throw new Error('There is no backend api address!!!');
}

export const fetcher = axios.create({ baseURL: apiURL });
