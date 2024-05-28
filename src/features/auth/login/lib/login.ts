import { getFullUser } from '@/entities/user/lib/user';
import { post } from '@/shared/api/Fetch';
import { PlainUser } from '@/shared/types/User';

export interface LoginSchema {
    email: string;
    password: string;
}

export const login = async (data: LoginSchema) => {
    const response = await post<LoginSchema, PlainUser>(
        '/auth/login',
        data,
        true,
    );

    const user = await getFullUser(response.id);

    return user;
};
