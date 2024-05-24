import { viewWishStore } from '@/entities/wish/model/wishStore';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { updateWish } from '../lib';

export const HideWish = () => {
    const wishStore = useStore(viewWishStore);

    const onClick = () => {
        if (!wishStore.wish) {
            return;
        }

        const isHidden = wishStore.wish.isHidden;

        const preparedWish = {
            isHidden: isHidden ? false : true,
        };

        if (wishStore.wish) {
            updateWish(preparedWish, wishStore.wish.id)
                .then(newWish => {
                    wishStore.setWish(newWish);
                    wishStore.setType('view');

                    toast.success('The wish successfully updated');
                })
                .catch(err => {
                    toast.error(err.message);
                });
        }
    };

    if (!wishStore.wish) {
        return (
            <Button asChild>
                <Skeleton className="w-full" />
            </Button>
        );
    }

    return (
        <Button variant="outline" onClick={onClick}>
            {wishStore.wish?.isHidden ? 'Reveal gift' : 'Hide gift'}
        </Button>
    );
};
