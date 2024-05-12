import axiosRequestWithoutBearer from '@/shared/lib/axios/axiosRequestWithoutBearer';
import { RegisterSchema } from '@/widgets/auth/register/lib';

export const register = async ({ confirmPassword, ...data }: RegisterSchema) =>
    await axiosRequestWithoutBearer.post('/users', data);
