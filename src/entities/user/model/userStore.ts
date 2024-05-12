import { User, Wish } from '@/shared/types/User';
import { Nullable } from '@/shared/types/Utility/Nullable';
import { createStore } from 'zustand';

type UserState = Nullable<User>;

export interface UserActions {
    setUser: (user: User) => void;
    setFollowers: (followers: User[]) => void;
    setFollowings: (followings: User[]) => void;
    setWishes: (wishes: Wish[]) => void;
}

export type UserStore = UserState & UserActions;

export const defaultInitState = {
    id: null,
    email: '',
    name: '',
    surname: '',
    picture: '',
    isActive: false,
    followings: [],
    followers: [],
    wishes: [],
    reservations: [],
};

export const createUserStore = (initState: UserState = defaultInitState) => {
    return createStore<UserStore>()(set => ({
        ...initState,
        setUser: (user: User) => set(() => ({ ...user })),
        setFollowers: followers => set(() => ({ followers })),
        setFollowings: followings => set(() => ({ followings })),
        setWishes: wishes => set(() => ({ wishes })),
    }));
};
// TODO: Add store handler
// export const createUserStore = createStore<UserStore>()(() => ({
//     user: null,
// }));
