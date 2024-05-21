import axiosRequestWithoutBearer from '@/shared/lib/axios/axiosRequestWithoutBearer';
import { User } from '@/shared/types/User';
import { LoginSchema } from '@/widgets/auth/login/lib';

export const login = async (credentials: LoginSchema) => {
    const response = await axiosRequestWithoutBearer.post(
        '/auth/login',
        credentials,
    );
    const body = response.data;

    localStorage.setItem('accessToken', body.accessToken);

    const user = await axiosRequestWithoutBearer.get(`/users/${body.id}`);

    return user.data as User;
};
