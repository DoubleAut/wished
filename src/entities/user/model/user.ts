import { GlobalStore } from '@/shared/types/GlobalStore';
import { PlainUser } from '@/shared/types/User';
import { StateCreator } from 'zustand';
export interface UserInformationSlice {
    user: PlainUser | null;
    setUser: (user: PlainUser | null) => void;
}

export const createUserInformationSlice: StateCreator<
    GlobalStore,
    [],
    [],
    UserInformationSlice
> = set => ({
    user: null,
    setUser: user => set({ user }),
});
