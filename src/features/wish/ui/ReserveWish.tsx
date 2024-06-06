'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { Wish } from '@/shared/types/Wish';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { cancelReservedWish, reserveWish } from '../lib';
import { dialogStore } from '../model/dialogView';

export const ReserveWish = () => {
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

                        revalidateTagFromServer('wishes');

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
