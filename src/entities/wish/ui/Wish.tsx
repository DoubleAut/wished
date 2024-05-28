'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { dialogStore } from '@/features/wish/model/dialogView';
import { Wish as IWish } from '@/shared/types/Wish';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import { useStore } from 'zustand';
import { PersonalWishActions } from './PersonalActions';
import { UserWishActions } from './UserWishActions';
import { WishCard } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';

export const Wish = ({ wish }: { wish: IWish }) => {
    const viewerId = useViewerStore(state => state.user?.id);
    const store = useStore(dialogStore);
    const setDialogWish = store.setDialogWish;

    if (wish.isReserved && viewerId !== wish?.reservedBy?.id) {
        return null;
    }

    return (
        <>
            {store.dialogMode === 'view' && (
                <WishDialog
                    key={wish.id + wish.title}
                    wish={wish}
                    trigger={<WishCard key={wish.id} wish={wish} />}
                    content={
                        <WishContent
                            actions={
                                viewerId === wish.owner.id ? (
                                    <PersonalWishActions key={wish.id} />
                                ) : (
                                    <UserWishActions key={wish.id} />
                                )
                            }
                            wish={wish}
                        />
                    }
                />
            )}
            {store.dialogMode === 'edit' && (
                <WishDialog
                    key={wish.id + wish.title}
                    wish={wish}
                    trigger={<WishCard key={wish.id} wish={wish} />}
                    content={
                        <WishForm
                            onCancel={() =>
                                setDialogWish(store.dialogWish, 'view')
                            }
                        />
                    }
                />
            )}
        </>
    );
};
