import { User } from '@/shared/types/User';
import { Wish } from '@/shared/types/Wish';
import { createStore } from 'zustand';

type UserState = {
    user: User | null;
};

export interface UserActions {
    setUser: (user: User) => void;
    setFollowers: (followers: User[]) => void;
    setFollowings: (followings: User[]) => void;
    setWishes: (wishes: Wish[]) => void;
}

export type UserStore = UserState & UserActions;

export const defaultInitState = {
    user: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
    return createStore<UserStore>()(set => ({
        ...initState,
        setUser: (user: User) => set(() => ({ user })),
        setFollowers: followers =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, followers } };
                }

                return state;
            }),
        setFollowings: followings =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, followings } };
                }

                return state;
            }),
        setWishes: wishes =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, wishes } };
                }

                return state;
            }),
    }));
};
