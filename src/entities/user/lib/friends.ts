import { get } from '@/shared/api/Fetch';
import { UserWithFriends } from '@/shared/types/User';

export const getUserWithFriends = async (friendId: number) => {
    const response = await get<UserWithFriends>(`/users/${friendId}/friends`, [
        'friends',
        'users',
    ]);

    return response;
};
