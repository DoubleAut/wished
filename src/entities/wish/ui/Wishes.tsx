import { Subheader } from '@/shared/ui/Text/subheader';

import { dialogStore } from '@/features/wish/model/dialogView';
import { DeleteWish } from '@/features/wish/ui/DeleteWish';
import { EditWish } from '@/features/wish/ui/EditWish';
import { HideWish } from '@/features/wish/ui/HideWish';
import { ReserveWish } from '@/features/wish/ui/ReserveWish';
import { Wish as IWish } from '@/shared/types/Wish';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { useStore } from 'zustand';
import { Wish } from './Wish';

export const PersonalWishActions = () => {
    const dialogWish = useStore(dialogStore);

    if (!dialogWish) {
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

export const WishesSkeleton = () => (
    <div className="flex flex-col gap-3">
        <Subheader>
            <Skeleton className="h-full w-full" />
        </Subheader>
        <div className="grid grid-cols-4 gap-3">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </div>
    </div>
);

export const Wishes = ({ wishes }: { wishes: IWish[] }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishes.map(wish => (
                <Wish key={wish.id} wish={wish} />
            ))}
        </div>
    );
};
