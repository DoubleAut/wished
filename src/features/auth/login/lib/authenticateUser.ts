import { post } from '@/shared/api/Fetch';

export interface AuthenticateUserSchema {
    email: string;
    username: string;
    password: string;
}

export const authenticateUser = async (data: AuthenticateUserSchema) => {
    const response = await post<
        AuthenticateUserSchema,
        { accessToken: string }
    >('/api/authorize', [], data, true);

    return response;
};
