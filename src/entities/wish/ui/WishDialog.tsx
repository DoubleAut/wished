import { Wish } from '@/shared/types/Wish';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { ReactNode, useState } from 'react';
import { useStore } from 'zustand';
import { viewWishStore } from '../model/wishStore';

interface Props {
    content: ReactNode;
    trigger: ReactNode;
    wish?: Wish;
}

/**
 * WishDialog is dialog component that is opens on trigger click. Utilizes onDemand store "ViewWishStore" to handle logic between view and edit mode.
 *
 * The first component that sets current wish in ViewWishStore.
 *
 * @param trigger - Clickable area that triggers dialogue to open
 * @param content - Inner content of the dialogue, that has been open on trigger
 * @param wish - Current wish, that is going to be displayed in dialog
 *
 * @returns dialog component with wish and its controls
 */

export const WishDialog = ({ trigger, content, wish }: Props) => {
    const wishStore = useStore(viewWishStore);
    const [isOpen, setOpen] = useState(false);

    const onOpenChange = () => {
        if (!isOpen) {
            setOpen(true);

            wish ? wishStore.setWish(wish) : wishStore.setWish(null);
        }

        if (isOpen) {
            setOpen(false);

            if (wish) {
                wishStore.setWish(null);
                wishStore.setType('view');
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger>{trigger}</DialogTrigger>
            <DialogContent className="max-h-screen w-full max-w-4xl overflow-auto">
                {content}
            </DialogContent>
        </Dialog>
    );
};
