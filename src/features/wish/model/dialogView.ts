import { Wish } from '@/shared/types/Wish';
import { create } from 'zustand';

export type DialogMode = 'edit' | 'view';

interface DialogStore {
    isOpen: boolean;
    dialogWish: Partial<Wish> | null;
    dialogMode: DialogMode;
    setOpen: (isOpen: boolean) => void;
    setDialogWish: (
        dialogWish: Partial<Wish> | null,
        dialogMode: DialogMode,
    ) => void;
}

export const dialogStore = create<DialogStore>()(set => ({
    isOpen: false,
    dialogWish: null,
    dialogMode: 'view',
    setOpen: (isOpen: boolean) => set({ isOpen }),
    setDialogWish: (dialogWish, dialogMode) => set({ dialogWish, dialogMode }),
}));
