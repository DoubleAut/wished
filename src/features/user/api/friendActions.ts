import { post, remove } from '@/shared/api/Fetch';
import { FRIENDS_TAG, USER_TAG } from '@/shared/lib/constants/FetchTags';
import { UserWithFriends } from '@/shared/types/User';

export const removeFriend = async (userId: number, friendId: number) => {
    const response = await remove<UserWithFriends>(
        `/users/${userId}/friends/${friendId}`,
        [USER_TAG, FRIENDS_TAG],
        true,
    );

    return response;
};

export const addFriend = async (userId: number, friendId: number) => {
    const response = await post<{}, UserWithFriends>(
        `/users/${userId}/friends/${friendId}`,
        [USER_TAG, FRIENDS_TAG],
        {},
        true,
    );

    return response;
};
