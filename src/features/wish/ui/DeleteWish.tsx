import { useViewerStore } from '@/core/providers/ViewerProvider';
import { viewWishStore } from '@/entities/wish/model/wishStore';
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

export const DeleteWish = () => {
    const viewerStore = useViewerStore(state => state);
    const wishStore = useStore(viewWishStore);

    const onClick = () => {
        if (!wishStore.wish) {
            return;
        }

        const wishId = wishStore.wish.id;

        deleteWish(wishId)
            .then(() => {
                if (viewerStore.user) {
                    const result = viewerStore.user.wishes.filter(
                        wish => wish.id !== wishId,
                    );

                    viewerStore.setWishes(result);
                }

                toast.success('Gift successfully deleted!');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    if (!wishStore.wish) {
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
