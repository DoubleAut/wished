import { viewWishStore } from '@/entities/wish/model/wishStore';
import { Button } from '@/shared/ui/button';
import { useStore } from 'zustand';

export const EditWish = () => {
    const wishStore = useStore(viewWishStore);

    return (
        <Button variant="outline" onClick={() => wishStore.setType('edit')}>
            Edit
        </Button>
    );
};
