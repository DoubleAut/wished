import { Wish } from '@/shared/types/Wish';
import { StateCreator } from 'zustand';
import { FriendsSlice } from '../../user/model/friendsStore';
import { UserInformationSlice } from '../../user/model/user';

export interface WishesSlice {
    wishes: Wish[];
    reservations: Wish[];
    addWish: (wish: Wish) => void;
    removeWish: (wish: Wish) => void;
    updateWish: (wish: Wish) => void;
    reserveWish: (wish: Wish) => void;
    cancelReservation: (wish: Wish) => void;
    setWishes: (wishes: Wish[]) => void;
    setReservations: (wishes: Wish[]) => void;
}

export const createWishesSlice: StateCreator<
    UserInformationSlice & WishesSlice & FriendsSlice,
    [],
    [],
    WishesSlice
> = (set, get) => ({
    wishes: [],
    reservations: [],
    setWishes: (wishes: Wish[]) => {
        set({ wishes });
    },
    setReservations: (reservations: Wish[]) => {
        set({ reservations });
    },
    addWish: (wish: Wish) => {
        const state = get();

        const wishes = [...state.wishes, wish];

        set({ wishes });
    },
    removeWish: (wish: Wish) => {
        const state = get();

        const wishes = state.wishes.filter(item => item.id !== wish.id);

        set({ wishes });
    },
    updateWish: (wish: Wish) => {
        const state = get();

        const wishes = state.wishes.map(item =>
            item.id === wish.id ? wish : item,
        );

        set({ wishes });
    },
    reserveWish: (wish: Wish) => {
        const state = get();

        const reservations = [...state.reservations, wish];

        set({ reservations });
    },
    cancelReservation: (wish: Wish) => {
        const state = get();

        const reservations = state.reservations.filter(
            item => item.id !== wish.id,
        );

        set({ reservations });
    },
});
