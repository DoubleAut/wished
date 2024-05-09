import { getUserByEmail } from '@/entities/user/lib/user';
import { User } from '@/shared/types/User';
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

export const setUser = async (email: string) => {
    userStore.setState({ isLoading: true });

    const user = await getUserByEmail(email);

    userStore.setState({ user });
};
