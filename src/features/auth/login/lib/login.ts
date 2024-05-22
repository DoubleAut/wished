import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { User } from '@/shared/types/User';
import { LoginSchema } from '@/widgets/auth/login/lib';

export const login = async (credentials: LoginSchema) => {
    const response = await axiosRequestWithBearer.post(
        '/auth/login',
        credentials,
    );
    const body = response.data;

    localStorage.setItem('accessToken', body.accessToken);

    const user = await axiosRequestWithBearer.get(`/users/${body.id}`);

    return user.data as User;
};
