import { getFullUser } from '@/entities/user/lib/user';
import { post } from '@/shared/api/Fetch';
import { setAccessToken } from '@/shared/api/Fetch/accessToken';
import { USER_TAG } from '@/shared/lib/constants/FetchTags';
import { PlainUser } from '@/shared/types/User';

export interface LoginSchema {
    email: string;
    password: string;
}

export const login = async (data: LoginSchema) => {
    const response = await post<
        LoginSchema,
        PlainUser & { accessToken: string }
    >('/auth/login', [USER_TAG], data, true);

    setAccessToken(response.accessToken);

    const user = await getFullUser(response.id);

    return user;
};
