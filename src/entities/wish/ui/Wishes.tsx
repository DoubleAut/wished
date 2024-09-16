'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { dialogStore } from '@/features/wish/model/dialogView';
import { CompleteWish } from '@/features/wish/ui/CompleteWish';
import { DeleteWish } from '@/features/wish/ui/DeleteWish';
import { EditWish } from '@/features/wish/ui/EditWish';
import { HideWish } from '@/features/wish/ui/HideWish';
import { ReserveWish } from '@/features/wish/ui/ReserveWish';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import { useStore } from 'zustand';
import { Wish as IWish } from '../../../../shared/types/Wish';
import { WishCard } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';

export const PersonalWishActions = () => (
    <div className="flex flex-col justify-end gap-2 sm:flex-row">
        <CompleteWish />
        <EditWish />
        <HideWish />
        <DeleteWish />
    </div>
);

export const UserWishActions = () => (
    <div className="flex flex-col gap-2 sm:flex-row">
        <ReserveWish />
    </div>
);

export const Wishes = ({ wishes }: { wishes: IWish[] }) => {
    const store = useStore(dialogStore);
    const viewer = useViewerStore(state => state.user);

    const visibleWishes = wishes.filter(item => {
        if (item.ownerId === viewer?.id) {
            return true;
        }

        if (item.reservedBy === 'None') {
            return true;
        }

        if (item.isHidden && item.ownerId === viewer?.id) {
            return true;
        }

        if (item.ownerId === viewer?.id && item.reservedBy === viewer?.id) {
            return true;
        }

        if (item.reservedBy && item.reservedBy === viewer?.id) {
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

export const ReservedWishes = ({ wishes }: { wishes: IWish[] }) => {
    const items = wishes.filter(item => !item.isCompleted);

    return items.map(wish => (
        <WishDialog
            wish={wish}
            key={wish.id + wish.title}
            trigger={<WishCard wish={wish} />}
            content={<WishContent />}
        />
    ));
};

export const GiftedWishes = ({ wishes }: { wishes: IWish[] }) => {
    const items = wishes.filter(item => item.isCompleted);

    return items.map(wish => (
        <WishDialog
            wish={wish}
            key={wish.id + wish.title}
            trigger={<WishCard wish={wish} />}
            content={<WishContent />}
        />
    ));
};

export const ArchivedWishes = ({ wishes }: { wishes: IWish[] }) => {
    const items = wishes.filter(item => item.isCompleted);

    return items.map(wish => (
        <WishDialog
            wish={wish}
            key={wish.id + wish.title}
            trigger={<WishCard wish={wish} />}
            content={<WishContent />}
        />
    ));
};
