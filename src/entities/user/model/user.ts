import { WishesSlice } from '@/entities/wish/model/wishesStore';
import { PlainUser } from '@/shared/types/User';
import { StateCreator } from 'zustand';
import { FriendsSlice } from './friendsStore';
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
