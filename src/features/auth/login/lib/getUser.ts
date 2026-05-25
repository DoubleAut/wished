import { USERS_ENDPOINT } from '@/shared/lib/constants/Config';
import { PlainUser } from '../../../../../shared/types/User';

export const getUser = async (accessToken: string): Promise<PlainUser> => {
    const response = await fetch(USERS_ENDPOINT, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status !== 200) {
        const err = (await response.json()) as { message: string };

        throw new Error(err.message);
    }

    const user = (await response.json()) as PlainUser;

    return user;
};
