'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Wish } from '@/shared/types/Wish';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { updateWish } from '../lib';
import { dialogStore } from '../model/dialogView';

export const CompleteWish = () => {
    const completeWish = useViewerStore(state => state.completeWish);
    const removeWish = useViewerStore(state => state.removeWish);
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setOpen = store.setOpen;

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wish = dialogWish as Wish;
        setOpen(false);

        updateWish({ isCompleted: true }, wish.id)
            .then(newWish => {
                removeWish(wish);
                completeWish(newWish);

                toast.success('The wish successfully updated');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    if (!dialogWish) {
        return (
            <Button asChild>
                <Skeleton className="w-fit" />
            </Button>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Complete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The gift will be archived.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="outline" onClick={onClick}>
                            Complete wish
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
