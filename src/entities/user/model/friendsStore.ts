import { WishesSlice } from '@/entities/wish/model/wishesStore';
import { PlainUser } from '@/shared/types/User';
import { StateCreator } from 'zustand';
import { UserInformationSlice } from './user';

export interface FriendsSlice {
    followers: PlainUser[];
    followings: PlainUser[];
    addFollower: (user: PlainUser) => void;
    removeFollower: (user: PlainUser) => void;
    setFollowers: (followers: PlainUser[]) => void;
    setFollowings: (followings: PlainUser[]) => void;
}

export const createFriendsSlice: StateCreator<
    UserInformationSlice & WishesSlice & FriendsSlice,
    [],
    [],
    FriendsSlice
> = (set, get) => ({
    followers: [],
    followings: [],
    setFollowers: followers => {
        set({ followers });
    },
    setFollowings: followings => {
        set({ followings });
    },
    addFollower: user => {
        const state = get();

        const followers = [...state.followers, user];

        set({ followers });
    },
    removeFollower: user => {
        const state = get();

        const followers = state.followers.filter(item => item.id !== user.id);

        set({ followers });
    },
});
