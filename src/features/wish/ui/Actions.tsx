'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
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
import {
    RiCloseLine,
    RiDeleteBin6Line,
    RiEditLine,
    RiEyeLine,
    RiEyeOffLine,
    RiGiftLine,
} from '@remixicon/react';
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

export const DeleteWish = ({ onAction }: Props) => {
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setOpen = store.setOpen;

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wishId = dialogWish.id;

        if (!wishId) {
            return;
        }

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
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-full"
                >
                    <RiDeleteBin6Line className="h-4 w-4" />
                </Button>
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
                    <AlertDialogCancel>
                        <RiCloseLine className="mr-1.5 h-4 w-4" />
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onClick}>
                            <RiDeleteBin6Line className="mr-1.5 h-4 w-4" />
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
        <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
            onClick={onClick}
        >
            <RiEditLine className="h-4 w-4" />
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
        <Button variant="outline" onClick={onClick} className="gap-1.5">
            {dialogWish?.isHidden ? (
                <>
                    <RiEyeLine className="h-4 w-4" />
                    Reveal gift
                </>
            ) : (
                <>
                    <RiEyeOffLine className="h-4 w-4" />
                    Hide gift
                </>
            )}
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

    const doReserve = () => {
        if (!dialogWish || !viewer) {
            return;
        }

        const wish = dialogWish as Wish;
        const id = wish.id;

        reserveWish(id, viewer.id)
            .then(reservedWish => {
                setDialogWish(reservedWish, 'view');

                moveWishToViewerReservations(reservedWish);

                queryClient.invalidateQueries({
                    queryKey: [WISHES_TAG],
                });

                toast.success('You found the perfect gift!', {
                    description: `"${reservedWish.title}" is now reserved. Time to wrap it up!`,
                    icon: <RiGiftLine className="text-accent h-5 w-5" />,
                });
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                onAction();
            });
    };

    const doCancelReservation = () => {
        if (!dialogWish || !viewer) {
            return;
        }

        const wish = dialogWish as Wish;
        const id = wish.id;

        cancelReservedWish(id)
            .then(reservedWish => {
                setDialogWish(reservedWish, 'view');

                removeWishFromViewerReservations(reservedWish);

                revalidateTagFromServer('wishes');

                toast.success('Reservation canceled', {
                    description: `"${reservedWish.title}" is available for someone else.`,
                });
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => {
                onAction();
            });
    };

    const onClick = () => {
        if (dialogWish && viewer) {
            const isReserved = dialogWish.reservedBy;

            if (!isReserved) {
                // Lightweight confirmation via toast with undo
                const wish = dialogWish as Wish;

                toast('Reserve this gift?', {
                    description: `"${wish.title}" will be marked as reserved.`,
                    duration: 6000,
                    action: {
                        label: 'Yes, reserve it',
                        onClick: doReserve,
                    },
                    cancel: {
                        label: 'Cancel',
                        onClick: () => {},
                    },
                });
            }

            if (isReserved && dialogWish.reservedBy === viewer.id) {
                doCancelReservation();
            }
        }
    };

    return (
        <Button
            variant={dialogWish?.reservedBy ? 'outline' : 'default'}
            size="lg"
            className="w-full gap-2"
            onClick={onClick}
        >
            {dialogWish?.reservedBy ? (
                <>
                    <RiCloseLine className="h-5 w-5" />
                    Cancel reservation
                </>
            ) : (
                <>
                    <RiGiftLine className="h-5 w-5" />
                    Reserve this gift
                </>
            )}
        </Button>
    );
};
