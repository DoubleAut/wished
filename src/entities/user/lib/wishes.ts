import { getUserByEmail } from './user';

export const getUserWishes = async (email: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        return [];
    }

    return user.wishes;
};
