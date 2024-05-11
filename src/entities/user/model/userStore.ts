import axiosRequestWithoutBearer from '@/shared/lib/axios/axiosRequestWithoutBearer';
import { User } from '@/shared/types/User';
import { LoginSchema } from '@/widgets/auth/login/lib';
import { RegisterSchema } from '@/widgets/auth/register/lib';
import { create } from 'zustand';

interface UserStore {
    user: User | null;
    isLoading: boolean;
}

export const userStore = create<UserStore>()(() => ({
    user: null,
    isLoading: false,
}));

export const getUser = (req: Request) => {
    const store = userStore.getState();

    return store.user;
};

export const register = async ({ confirmPassword, ...data }: RegisterSchema) =>
    await axiosRequestWithoutBearer.post('/users', data);

export const login = async (data: LoginSchema) => {
    const response = await axiosRequestWithoutBearer.post('/auth/login', data);
    const { accessToken, ...user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    userStore.setState({ user });
};
