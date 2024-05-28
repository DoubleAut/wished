import { post } from '@/shared/api/Fetch';
import { UserWithFriends } from '@/shared/types/User';

export const removeFriend = async (userId: number, friendId: number) => {
    const response = await post<{}, UserWithFriends>(
        `/users/${userId}/friends/remove/${friendId}`,
        {},
        true,
    );

    return response;
};

export const addFriend = async (userId: number, friendId: number) => {
    const response = await post<{}, UserWithFriends>(
        `/users/${userId}/friends/add/${friendId}`,
        {},
        true,
    );

    return response;
};
