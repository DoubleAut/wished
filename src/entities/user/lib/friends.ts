import { getUserByEmail, getUserById } from './user';

export const getUserFriends = async (email: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        return [];
    }

    const friends = user.friends.map(id => getUserById(id));
    const result = await Promise.all(friends);

    return result.filter(Boolean);
};
