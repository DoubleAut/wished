'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { queryClient } from '@/shared/lib/constants/Query/QueryClient';
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
import {
    cancelReservedWish,
    deleteWish,
    reserveWish,
    updateWish,
} from '../lib';
import { dialogStore } from '../model/dialogView';

interface Props {
    onAction: () => void;
}

export const CompleteWish = ({ onAction }: Props) => {
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

                queryClient.invalidateQueries({ queryKey: [WISHES_TAG] });

                toast.success('The wish successfully updated');
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                onAction();
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

export const DeleteWish = ({ onAction }: Props) => {
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setOpen = store.setOpen;

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wishId = dialogWish.id as number;

        setOpen(false);

        deleteWish(wishId)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: [WISHES_TAG] });

                toast.success('Wish successfully deleted!');
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                onAction();
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

export const EditWish = ({ onAction }: Props) => {
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setDialogWish = store.setDialogWish;

    const onClick = () => setDialogWish(dialogWish, 'edit');

    return (
        <Button variant="outline" onClick={onClick}>
            Edit
        </Button>
    );
};

export const HideWish = ({ onAction }: Props) => {
    const updateViewerWish = useViewerStore(state => state.updateWish);
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setDialogWish = store.setDialogWish;

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wish = dialogWish as Wish;

        const isHidden = wish.isHidden;

        updateWish({ isHidden: !isHidden }, wish.id)
            .then(newWish => {
                setDialogWish(newWish, 'view');

                updateViewerWish(newWish);

                queryClient.invalidateQueries({ queryKey: [WISHES_TAG] });

                toast.success('The wish successfully updated');
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                onAction();
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
        <Button variant="outline" onClick={onClick}>
            {dialogWish?.isHidden ? 'Reveal gift' : 'Hide gift'}
        </Button>
    );
};

export const ReserveWish = ({ onAction }: Props) => {
    const dialogWishStore = useStore(dialogStore);
    const dialogWish = dialogWishStore.dialogWish;
    const setDialogWish = dialogWishStore.setDialogWish;

    const viewer = useViewerStore(state => state.user);

    const moveWishToViewerReservations = useViewerStore(
        state => state.reserveWish,
    );
    const removeWishFromViewerReservations = useViewerStore(
        state => state.cancelReservation,
    );

    if (!dialogWish) {
        return null;
    }

    const onClick = () => {
        if (dialogWish && viewer) {
            const isReserved = dialogWish.reservedBy;
            const wish = dialogWish as Wish;

            if (!isReserved) {
                const id = wish.id;

                reserveWish(id)
                    .then(reservedWish => {
                        setDialogWish(reservedWish, 'view');

                        moveWishToViewerReservations(reservedWish);

                        queryClient.invalidateQueries({
                            queryKey: [WISHES_TAG],
                        });

                        toast.success('Wish successfully reserved');
                    })
                    .catch(err => {
                        toast.error(err.message);
                    });
            }

            if (isReserved && dialogWish.reservedBy?.id === viewer.id) {
                const wish = dialogWish as Wish;
                const id = wish.id;

                cancelReservedWish(id)
                    .then(reservedWish => {
                        setDialogWish(reservedWish, 'view');

                        removeWishFromViewerReservations(reservedWish);

                        revalidateTagFromServer('wishes');

                        toast.success('Successfully canceled the reservation');
                    })
                    .catch(err => {
                        toast.error(err.message);
                    });
            }
        }
    };

    return (
        <Button variant="outline" onClick={onClick}>
            {dialogWish?.reservedBy ? 'Cancel reservation' : 'Reserve'}
        </Button>
    );
};
