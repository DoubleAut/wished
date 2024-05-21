import axiosRequestWithoutBearer from '@/shared/lib/axios/axiosRequestWithoutBearer';
import { User } from '@/shared/types/User';
import '@total-typescript/ts-reset';

export const getUsers = async () => {
    const response = await axiosRequestWithoutBearer.get('/users');

    return response.data as User[];
};

export const getUser = async (id: number) => {
    const response = await axiosRequestWithoutBearer.get(`/users/${id}`);

    return response.data as User;
};
