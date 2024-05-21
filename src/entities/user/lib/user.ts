import { fetcher } from '@/shared/lib/axios';
import { User } from '@/shared/types/User';
import '@total-typescript/ts-reset';

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await fetcher.get(`/users?email=${email}`);

    try {
        const result = user.data[0];

        return result;
    } catch (e) {
        return null;
    }
};

export const getUserById = async (id: number): Promise<User | null> => {
    const user = await fetcher.get(`/users?id=${id}`);

    try {
        const result = user.data[0];

        return result;
    } catch (e) {
        return null;
    }
};

export const updateUser = async (
    id: number,
    body: Partial<User>,
): Promise<User | null> => {
    const user = await fetcher.put(`/users/${id}`, body);

    try {
        const result = user.data[0];

        return result;
    } catch (e) {
        return null;
    }
};
