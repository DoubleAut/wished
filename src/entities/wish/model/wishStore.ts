import { Wish } from '@/shared/types/Wish';
import { create } from 'zustand';

export type WISH_TYPES = 'view' | 'edit';

interface WishStore {
    wish: Wish | null;
    type: WISH_TYPES;
    setType: (type: WISH_TYPES) => void;
    setWish: (wish: Wish | null) => void;
}

export const viewWishStore = create<WishStore>()(set => ({
    wish: null,
    type: 'view',
    setType: type => set({ type }),
    setWish: (wish: Wish | null) => set({ wish }),
}));
