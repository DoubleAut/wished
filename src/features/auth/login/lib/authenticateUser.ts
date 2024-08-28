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

    // const response = await fetch('/api/authorize', {
    //     method: 'POST',
    //     credentials: 'include',
    //     body: JSON.stringify(data),
    // });

    return response;
};
