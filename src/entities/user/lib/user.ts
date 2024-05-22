import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { User } from '@/shared/types/User';
import '@total-typescript/ts-reset';

export const getUsers = async () => {
    const response = await axiosRequestWithBearer.get('/users');

    return response.data as User[];
};

export const getUser = async (id: number) => {
    const response = await axiosRequestWithBearer.get(`/users/${id}`);

    return response.data as User;
};
