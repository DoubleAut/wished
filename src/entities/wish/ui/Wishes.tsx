import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Wish as IWish, Wish } from '@/shared/types/Wish';
import { Subheader } from '@/shared/ui/Text/subheader';

import { DeleteWish } from '@/features/wish/ui/DeleteWish';
import { EditWish } from '@/features/wish/ui/EditWish';
import { HideWish } from '@/features/wish/ui/HideWish';
import { ReserveWish } from '@/features/wish/ui/ReserveWish';
import { User } from '@/shared/types/User';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import { useStore } from 'zustand';
import { viewWishStore } from '../model/wishStore';
import { WishCard } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';

interface WishesProps {
    wishes?: IWish[];
}

export const PersonalWishActions = () => {
    const wishStore = useStore(viewWishStore);

    if (!wishStore.wish) {
        return (
            <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="w-full" asChild>
                    <Skeleton />
                </Button>
                <Button className="w-full" asChild>
                    <Skeleton />
                </Button>
                <Button className="w-full" asChild>
                    <Skeleton />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <EditWish />
            <HideWish />
            <DeleteWish />
        </div>
    );
};

export const UserWishActions = () => {
    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <ReserveWish />
        </div>
    );
};

const getVisibleWishOrNull = (wish: Wish, viewer: User) => {
    const isOwnWish = wish.owner.id === viewer?.id;

    // Wish is hidden and current user is not wish owner
    if (wish.isHidden && !isOwnWish) {
        return null;
    }

    if (wish.isReserved && wish.reservedBy?.id !== viewer.id) {
        return null;
    }

    return wish;
};

export const Wishes = ({ wishes }: WishesProps) => {
    const viewer = useViewerStore(state => state.user);
    const store = useStore(viewWishStore);

    if (!wishes) {
        return (
            <div className="flex flex-col gap-3">
                <Subheader>
                    <Skeleton />
                </Subheader>
                <div className="grid grid-cols-4 gap-3">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishes.map(wish => {
                if (viewer) {
                    const validatedWish = getVisibleWishOrNull(wish, viewer);

                    if (!validatedWish) {
                        return null;
                    }

                    const actions =
                        wish.owner.id === viewer.id ? (
                            <PersonalWishActions key={wish.id} />
                        ) : (
                            <UserWishActions key={wish.id} />
                        );

                    const content =
                        store.type === 'view' ? (
                            <WishContent actions={actions} wish={wish} />
                        ) : (
                            <WishForm
                                onCancel={() => {
                                    store.setType('view');
                                    store.setWish(null);
                                }}
                            />
                        );

                    return (
                        <WishDialog
                            key={wish.id + wish.title}
                            wish={validatedWish}
                            trigger={<WishCard key={wish.id} wish={wish} />}
                            content={content}
                        />
                    );
                }

                return (
                    <WishDialog
                        key={wish.id + wish.title}
                        wish={wish}
                        trigger={<WishCard key={wish.id} wish={wish} />}
                        content={<WishContent actions={<></>} wish={wish} />}
                    />
                );
            })}
        </div>
    );
};
