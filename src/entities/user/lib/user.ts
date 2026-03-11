import { getMyWishesPaginated } from '@/entities/wish/lib';
import { getCategories } from '@/features/category/lib';
import { get } from '@/shared/api/Fetch';
import { FullUser, PlainUser } from '@/shared/types/User';
import '@total-typescript/ts-reset';
import { getUserWithFriends } from './friends';

export const getUsers = async () => {
    const response = await get<FullUser[]>('/users', ['users']);

    return response;
};

export const getUser = async (id: number) => {
    const response = await get<PlainUser>(`/users/${id}`, ['user']);

    return response;
};

export const getOwnFullUser = async (id: number) => {
    const user = await getUserWithFriends(id);
    const wishes = await getMyWishesPaginated(id);
    const categories = await getCategories(id);

    return {
        ...user,
        ...wishes,
        categories,
    };
};
