import { FullUser } from '@/shared/types/User';
import { Wish } from '@/shared/types/Wish';
import { StateCreator } from 'zustand';
import { FriendsSlice } from '../../user/model/friendsStore';
import { UserInformationSlice } from '../../user/model/user';

export interface WishesSlice {
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
    setGifted: (wishes: Wish[]) => void;
    setCompleted: (wishes: Wish[]) => void;
    setFullUser: (user: FullUser) => void;
}

export const createWishesSlice: StateCreator<
    UserInformationSlice & WishesSlice & FriendsSlice,
    [],
    [],
    WishesSlice
> = (set, get) => ({
    wishes: [],
    reservations: [],
    gifted: [],
    completed: [],
    setWishes: wishes => {
        set({ wishes });
    },
    setReservations: reservations => {
        set({ reservations });
    },
    setGifted: gifted => {
        set({ gifted });
    },
    setCompleted: completed => {
        set({ completed });
    },
    addWish: wish => {
        const state = get();

        const wishes = [...state.wishes, wish];

        set({ wishes });
    },
    removeWish: wish => {
        const state = get();

        if (wish.isCompleted) {
            const completed = state.completed.filter(item => item.id !== wish.id);
    
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
    setFullUser: user => {
        const state = get();
        const {
            followers,
            followings,
            wishes,
            reservations,
            gifted,
            completed,
            ...rest
        } = user;

        state.setUser(rest);
        state.setFollowers(followers);
        state.setFollowings(followings);
        state.setWishes(wishes);
        state.setReservations(reservations);
        state.setGifted(gifted);
        state.setCompleted(completed);
    },
});
