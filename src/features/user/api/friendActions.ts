import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { User } from '@/shared/types/User';

export const removeFriend = async (userId: number, friendId: number) => {
    const response = await axiosRequestWithBearer.delete(
        `/users/${userId}/friends/${friendId}`,
    );

    return response.data as User;
};

export const addFriend = async (userId: number, friendId: number) => {
    const response = await axiosRequestWithBearer.post(
        `/users/${userId}/friends/${friendId}`,
    );

    return response.data as User;
};
