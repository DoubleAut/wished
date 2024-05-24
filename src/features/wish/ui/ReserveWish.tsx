import { useViewerStore } from '@/core/providers/ViewerProvider';
import { viewWishStore } from '@/entities/wish/model/wishStore';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { cancelReservedWish, reserveWish } from '../lib';

export const ReserveWish = () => {
    const { user, ...viewerStore } = useViewerStore(state => state);
    const { wish, ...wishStore } = useStore(viewWishStore);

    const onClick = () => {
        const isReserved = wish?.isReserved;

        if (wish && user) {
            if (!isReserved) {
                const id = wish.id;

                reserveWish(id)
                    .then(reservedWish => {
                        const result = [...user.reservations, reservedWish];

                        viewerStore.setReservations(result);
                        wishStore.setWish(reservedWish);

                        toast.success('Wish successfully reserved');
                    })
                    .catch(err => {
                        toast.error(err.message);
                    });
            }

            if (isReserved && wish.reservedBy?.id === user.id) {
                const id = wish.id;

                cancelReservedWish(id)
                    .then(reservedWish => {
                        const result = user.reservations.filter(
                            item => item.id !== id,
                        );

                        viewerStore.setReservations(result);

                        wishStore.setWish(reservedWish);

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
            {wish?.isReserved ? 'Cancel reservation' : 'Reserve'}
        </Button>
    );
};
