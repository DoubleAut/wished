import { DialogMode, dialogStore } from '@/features/wish/model/dialogView';
import { DeleteWish } from '@/features/wish/ui/DeleteWish';
import { EditWish } from '@/features/wish/ui/EditWish';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { ReactNode } from 'react';
import { useStore } from 'zustand';
import { Wish } from '../../../../shared/types/Wish';

interface Props {
    content: ReactNode;
    trigger: ReactNode;
    className?: string;
    wish: Partial<Wish> | null;
    isButtonTrigger?: boolean;
    defaultMode?: DialogMode;
}

/**
 * WishDialog is dialog component that is opens on trigger click. Utilizes onDemand store "dialogStore" to handle logic between view and edit mode.
 *
 * The first component that sets current wish in dialogStore.
 *
 * @param trigger - Clickable area that triggers dialogue to open
 * @param content - Inner content of the dialogue, that has been open on trigger
 * @param wish - Current wish, that is going to be displayed in dialog
 *
 * @returns dialog component with wish and its controls
 */

export const WishDialog = ({
    wish,
    trigger,
    content,
    isButtonTrigger = false,
    defaultMode = 'view',
}: Props) => {
    const store = useStore(dialogStore);
    const isStoreWishIsTheSame = store.dialogWish?.id === wish?.id;
    const isOpen = store.isOpen && isStoreWishIsTheSame;
    const setOpen = store.setOpen;
    const setDialogWish = store.setDialogWish;

    const onOpenChange = (value: boolean) => {
        if (value) {
            setDialogWish(wish, defaultMode);
        }

        setOpen(value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild={isButtonTrigger}>{trigger}</DialogTrigger>
            <DialogContent className="max-w-xl overflow-auto p-6">
                <DialogHeader className="relative flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-2xl font-bold">
                        {wish?.title}
                    </DialogTitle>
                    <div className="flex space-x-2">
                        <EditWish />
                        <DeleteWish />
                    </div>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
};
