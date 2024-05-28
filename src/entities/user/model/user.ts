import { PlainUser, UserWithFriends } from '@/shared/types/User';
import { StateCreator, create } from 'zustand';
import { getUser } from '../lib/user';
import { FriendsSlice } from './friendsStore';
import { WishesSlice } from './wishesStore';

interface UserStore {
    user: UserWithFriends | null;
    setUser: (user: UserWithFriends) => void;
}

export const userStore = create<UserStore>()(set => ({
    user: null,
    setUser: (user: UserWithFriends) => {
        set({ user });
    },
}));

export const setInitialUser = async (id: number) => {
    const user = await getUser(id);

    userStore.setState({ user });
};

export interface UserInformationSlice {
    user: PlainUser | null;
    setUser: (user: PlainUser) => void;
}

export const createUserInformationSlice: StateCreator<
    UserInformationSlice & WishesSlice & FriendsSlice,
    [],
    [],
    UserInformationSlice
> = set => ({
    user: null,
    setUser: (user: PlainUser) => set({ user }),
});
