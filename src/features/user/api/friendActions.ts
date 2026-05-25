import { post, remove } from '@/shared/api/Fetch';
import { USERS_ENDPOINT } from '@/shared/lib/constants/Config';
import { FRIENDS_TAG, USER_TAG } from '@/shared/lib/constants/FetchTags';
import { UserWithFriends } from '../../../../shared/types/User';

export const removeFriend = async (userId: string, friendId: string) => {
    const response = await remove<UserWithFriends>(
        `${USERS_ENDPOINT}/${userId}/friends/${friendId}`,
        [USER_TAG, FRIENDS_TAG],
        true,
    );

    return response;
};

export const addFriend = async (userId: string, friendId: string) => {
    const response = await post<{}, UserWithFriends>(
        `${USERS_ENDPOINT}/${userId}/friends/${friendId}`,
        [USER_TAG, FRIENDS_TAG],
        {},
        true,
    );

    return response;
};
