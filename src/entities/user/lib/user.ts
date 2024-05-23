import { User } from '@/shared/types/User';
import '@total-typescript/ts-reset';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export const getUsers = async () => {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error('Error occured while retrieving user');
    }

    const result = await response.json();

    return result as User[];
};

export const getUser = async (id: number) => {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
        throw new Error('Error occured while retrieving user');
    }

    const result = await response.json();

    return result as User;
};
