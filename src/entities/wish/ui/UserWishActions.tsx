import { ReserveWish } from '@/features/wish/ui/Actions';
import { Skeleton } from '@/shared/ui/skeleton';

export const UserWishActionsSkeleton = () => (
    <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full rounded-xl" />
    </div>
);

export const UserWishActions = () => {
    return (
        <div className="flex flex-col gap-2">
            <ReserveWish onAction={() => {}} />
        </div>
    );
};
