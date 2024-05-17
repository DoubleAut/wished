import { Wish } from '@/shared/types/Wish';
import { create } from 'zustand';
import { getUserWishes } from '../lib/wishes';

interface WishesStore {
    wishes: Wish[];
    isLoading: boolean;
}

export const wishesStore = create<WishesStore>()(() => ({
    wishes: [],
    isLoading: false,
}));

export const setWishes = async (email: string) => {
    wishesStore.setState({ isLoading: true });

    const wishes = await getUserWishes(email);

    wishesStore.setState({ wishes, isLoading: false });
};
