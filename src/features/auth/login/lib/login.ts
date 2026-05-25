import { setAccessToken } from '@/shared/api/Fetch/accessToken';
import { getUser } from './getUser';

export interface LoginSchema {
    username: string;
    email: string;
    password: string;
}

export const login = async (data: LoginSchema) => {
    // Native fetch is used, due to post method being fetched with default API at the start
    // TODO: pick out default API, to use whole address, not specificly user

    const response = await fetch('/api/authorize', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Autorize failed.');
    }

    const result = (await response.json()) as { accessToken: string };

    setAccessToken(result.accessToken);

    const user = await getUser(result.accessToken);

    return user;
};
