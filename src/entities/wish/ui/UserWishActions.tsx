import { ReserveWish } from '@/features/wish/ui/ReserveWish';
import { Skeleton } from '@/shared/ui/skeleton';

export const UserWishActionsSkeleton = () => (
    <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton />
    </div>
);

export const UserWishActions = () => {
    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <ReserveWish />
        </div>
    );
};
