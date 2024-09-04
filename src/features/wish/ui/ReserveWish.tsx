'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { Wish } from '../../../../shared/types/Wish';
import { cancelReservedWish, reserveWish } from '../lib';
import { dialogStore } from '../model/dialogView';

export const ReserveWish = () => {
    const dialogWishStore = useStore(dialogStore);
    const userStore = useViewerStore(state => state.user);
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
        if (!userStore) {
            return;
        }

        if (dialogWish && viewer) {
            const isReserved = dialogWish.reservedBy;
            const wish = dialogWish as Wish;

            if (!isReserved) {
                const id = wish.id;

                reserveWish(id, userStore.id)
                    .then(reservedWish => {
                        setDialogWish({}, 'view');

                        moveWishToViewerReservations(reservedWish);

                        revalidateTagFromServer('wishes');

                        toast.success('Wish successfully reserved');
                    })
                    .catch(err => {
                        toast.error(err.message);
                    });
            }

            if (isReserved && dialogWish.reservedBy === viewer.id) {
                const wish = dialogWish as Wish;
                const id = wish.id;

                cancelReservedWish(id)
                    .then(result => {
                        const reservedWish = result as Wish;

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
