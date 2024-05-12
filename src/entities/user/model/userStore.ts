import { User } from '@/shared/types/User';
import { createStore } from 'zustand';

export interface UserStore {
    user: User | null;
}
// TODO: Add store handler
export const createUserStore = createStore<UserStore>()(() => ({
    user: null,
}));

export const getUser = (req: Request) => {
    const store = createUserStore.getState();

    return store.user;
};
