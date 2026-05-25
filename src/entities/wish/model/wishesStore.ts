import { StateCreator } from 'zustand';
import { Wish } from '../../../../shared/types/Wish';

export interface WishesSlice {
    isLoading: boolean;
    wishes: Wish[];
    reservations: Wish[];
    gifted: Wish[];
    completed: Wish[];
    addWish: (wish: Wish) => void;
    removeWish: (wish: Wish) => void;
    updateWish: (wish: Wish) => void;
    reserveWish: (wish: Wish) => void;
    completeWish: (wish: Wish) => void;
    cancelReservation: (wish: Wish) => void;
    setWishes: (wishes: Wish[]) => void;
    setReservations: (wishes: Wish[]) => void;
}

export const createWishesSlice: StateCreator<
    WishesSlice,
    [],
    [],
    WishesSlice
> = (set, get) => ({
    isLoading: false,
    wishes: [],
    reservations: [],
    gifted: [],
    completed: [],
    setWishes: data => {
        const wishes = data.filter(wish => !Boolean(wish.isCompleted));

        const completed = data.filter(wish => Boolean(wish.isCompleted));

        set({ wishes, completed });
    },
    setReservations: data => {
        const reservations = data.filter(wish => !Boolean(wish.isCompleted));

        const gifted = data.filter(wish => Boolean(wish.isCompleted));

        set({ reservations, gifted });
    },
    addWish: wish => {
        const state = get();

        const wishes = [...state.wishes, wish];

        set({ wishes });
    },
    removeWish: wish => {
        const state = get();

        if (wish.isCompleted) {
            const completed = state.completed.filter(
                item => item.id !== wish.id,
            );

            set({ completed });
        }

        if (!wish.isCompleted) {
            const wishes = state.wishes.filter(item => item.id !== wish.id);

            set({ wishes });
        }
    },
    updateWish: wish => {
        const state = get();

        const wishes = state.wishes.map(item =>
            item.id === wish.id ? wish : item,
        );

        set({ wishes });
    },
    reserveWish: wish => {
        const state = get();

        const reservations = [...state.reservations, wish];

        set({ reservations });
    },
    completeWish: wish => {
        const state = get();

        const completed = [...state.completed, wish];

        set({ completed });
    },
    cancelReservation: wish => {
        const state = get();

        const reservations = state.reservations.filter(
            item => item.id !== wish.id,
        );

        set({ reservations });
    },
});
