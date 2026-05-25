import { get } from '@/shared/api/Fetch';
import { USERS_ENDPOINT } from '@/shared/lib/constants/Config';
import { UserWithFriends } from '../../../../shared/types/User';

export const getUserWithFriends = async (userId: number) => {
    const response = await get<UserWithFriends>(
        `${USERS_ENDPOINT}/${userId}/friends`,
        ['friends', 'users'],
    );

    return response;
};
