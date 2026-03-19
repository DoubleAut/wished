import { dialogStore } from '@/features/wish/model/dialogView';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import { useStore } from 'zustand';
import { getUserWishes } from '../lib';
import { WishCard } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';

export const SSRWishes = async ({
    userId,
    viewerId,
}: {
    userId: string;
    viewerId: string;
}) => {
    const store = useStore(dialogStore);
    const wishes = await getUserWishes(userId);

    const visibleWishes = wishes.filter(item => {
        if (item.ownerId === viewerId) {
            return true;
        }

        if (!item.reservedBy) {
            return true;
        }

        if (item.ownerId === viewerId && item.reservedBy) {
            return true;
        }

        if (item.reservedBy && item.reservedBy === viewerId) {
            return true;
        }

        return false;
    });

    const isView = store.dialogMode === 'view';

    return visibleWishes.map(wish => (
        <WishDialog
            wish={wish}
            key={wish.id + wish.title}
            trigger={<WishCard wish={wish} />}
            content={
                isView ? <WishContent /> : <WishForm onCancel={() => {}} />
            }
        />
    ));
};
