import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { RegisterSchema } from '@/widgets/auth/register/lib';

export const register = async ({ confirmPassword, ...data }: RegisterSchema) =>
    await axiosRequestWithBearer.post('/users', data);
