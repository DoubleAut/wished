import { DeleteWish } from '@/features/wish/ui/DeleteWish';
import { EditWish } from '@/features/wish/ui/EditWish';
import { HideWish } from '@/features/wish/ui/HideWish';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

export const PersonalWishActionsSkeleton = () => (
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

export const PersonalWishActions = () => {
    return (
        <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <EditWish />
            <HideWish />
            <DeleteWish />
        </div>
    );
};
