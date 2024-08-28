import { PlainUser } from '../../../../../shared/types/User';
import { USERS_ENDPOINT } from './api';

export const getUser = async (accessToken: string): Promise<PlainUser> => {
    const response = await fetch(USERS_ENDPOINT, {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status !== 200) {
        const err = (await response.json()) as { message: string };

        throw new Error(err.message);
    }

    const user = (await response.json()) as PlainUser;

    return user;
};
