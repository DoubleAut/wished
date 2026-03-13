import { DeleteWish, EditWish, HideWish } from '@/features/wish/ui/Actions';
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
            <EditWish onAction={() => {}} />
            <HideWish onAction={() => {}} />
            <DeleteWish onAction={() => {}} />
        </div>
    );
};
