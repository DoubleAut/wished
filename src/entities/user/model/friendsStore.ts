import { User } from '@/shared/types/User';
import { create } from 'zustand';
import { getUserFriends } from '../lib/friends';

interface FriendsStore {
    friends: User[];
    isLoading: boolean;
}

export const friendsStore = create<FriendsStore>()(() => ({
    friends: [],
    isLoading: false,
}));

export const setFriends = async (email: string) => {
    friendsStore.setState({ isLoading: true });

    const friends = await getUserFriends(email);

    friendsStore.setState({ friends, isLoading: false });
};
