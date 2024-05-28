import { Wish } from '@/shared/types/Wish';
import { create } from 'zustand';

interface DialogStore {
    dialogWish: Partial<Wish> | null;
    dialogMode: 'edit' | 'view';
    setDialogWish: (
        dialogWish: Partial<Wish> | null,
        dialogMode: 'edit' | 'view',
    ) => void;
}

export const dialogStore = create<DialogStore>()(set => ({
    dialogWish: null,
    dialogMode: 'view',
    setDialogWish: (dialogWish, dialogMode) => {
        set({ dialogWish, dialogMode });
    },
}));
