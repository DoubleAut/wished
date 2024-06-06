import { getOwnWishes } from '@/entities/wish/lib';
import { get } from '@/shared/api/Fetch';
import { FullUser, UserWithFriends } from '@/shared/types/User';
import '@total-typescript/ts-reset';
import { getUserWithFriends } from './friends';

export const getUsers = async () => {
    const response = await get<FullUser[]>('/users', ['users']);

    return response;
};

export const getUser = async (id: number) => {
    const response = await get<UserWithFriends>(`/users/${id}/friends`, [
        'user',
        'friends',
    ]);

    return response;
};

export const getOwnFullUser = async (id: number) => {
    const user = await getUserWithFriends(id);
    const result = await getOwnWishes(id);

    return {
        ...user,
        ...result,
    };
};
