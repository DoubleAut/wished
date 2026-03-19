import { redirect } from 'next/navigation';
import { authenticateUser } from './authenticateUser';

export interface LoginSchema {
    username: string;
    email: string;
    password: string;
}

export const login = async (data: LoginSchema) => {
    const response = await authenticateUser(data);

    if (!response.accessToken) {
        throw new Error('Authentication failed');
    }

    redirect('/');
};
