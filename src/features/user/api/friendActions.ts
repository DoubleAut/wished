import { getUser } from '@/entities/user/lib/user';
import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';

export const removeFriend = async (userId: number, friendId: number) => {
    await axiosRequestWithBearer.delete(`/users/${userId}/friends/${friendId}`);

    const user = await getUser(userId);

    return user;
};

export const addFriend = async (userId: number, friendId: number) => {
    await axiosRequestWithBearer.post(`/users/${userId}/friends/${friendId}`);

    const user = await getUser(userId);

    return user;
};
