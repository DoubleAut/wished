import { User } from '@/shared/types/User';
import { create } from 'zustand';
import { getUser } from '../lib/user';

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
}

export const userStore = create<UserStore>()(set => ({
    user: null,
    setUser: (user: User) => {
        set({ user });
    },
}));

export const setInitialUser = async (id: number) => {
    const user = await getUser(id);

    userStore.setState({ user });
};
