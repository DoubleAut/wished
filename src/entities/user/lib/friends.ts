import { get } from '@/shared/api/Fetch';
import { UserWithFriends, PlainUser } from '@/shared/types/User';

export const getUserWithFriends = async (userId: number) => {
    const response = await get<UserWithFriends>(`/users/${userId}/friends`, [
        'friends',
        'users',
    ]);

    return response;
};
