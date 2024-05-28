import { dialogStore } from '@/features/wish/model/dialogView';
import { Wish } from '@/shared/types/Wish';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { ReactNode, useEffect, useState } from 'react';
import { useStore } from 'zustand';

interface Props {
    content: ReactNode;
    trigger: ReactNode;
    wish: Partial<Wish> | null;
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

export const WishDialog = ({ trigger, content, wish }: Props) => {
    const store = useStore(dialogStore);
    const setDialogWish = store.setDialogWish;
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setDialogWish(wish, 'view');
        }
    }, [isOpen, setDialogWish, wish]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger>{trigger}</DialogTrigger>
            <DialogContent className="h-fit max-h-screen max-w-4xl overflow-auto p-6">
                {content}
            </DialogContent>
        </Dialog>
    );
};
