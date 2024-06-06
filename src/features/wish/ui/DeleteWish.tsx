import { useViewerStore } from '@/core/providers/ViewerProvider';
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
import { deleteWish } from '../lib';
import { dialogStore } from '../model/dialogView';

export const DeleteWish = () => {
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setOpen = store.setOpen;
    const removeWish = useViewerStore(state => state.removeWish);

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wishId = dialogWish.id as number;

        setOpen(false);

        deleteWish(wishId)
            .then(newWish => {
                removeWish(newWish);

                toast.success('Wish successfully deleted!');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    if (!dialogWish) {
        return (
            <Button asChild>
                <Skeleton className="w-full" />
            </Button>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete wish</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The gift will be
                        permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="outline" onClick={onClick}>
                            Delete wish
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
