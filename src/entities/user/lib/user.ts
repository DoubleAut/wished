import { USERS_ENDPOINT } from '@/features/auth/login/lib/api';
import { get } from '@/shared/api/Fetch';
import '@total-typescript/ts-reset';
import { FullUser, PlainUser } from '../../../../shared/types/User';

export const getUsers = async () => {
    const response = await get<FullUser[]>('/users', ['users']);

    return response;
};

type GetUserResponse = { message: string; user: PlainUser };

export const getUser = async (id: string) => {
    const response = await get<GetUserResponse>(`${USERS_ENDPOINT}/${id}`, [
        'user',
        'friends',
    ]);

    console.log('Response: ', response);

    return response.user;
};
