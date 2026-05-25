import { HideWish } from '@/features/wish/ui/Actions';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

export const PersonalWishActionsSkeleton = () => (
    <div className="flex gap-2">
        <Button asChild>
            <Skeleton className="h-10 w-full rounded-xl" />
        </Button>
        <Button asChild>
            <Skeleton className="h-10 w-full rounded-xl" />
        </Button>
    </div>
);

export const PersonalWishActions = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <HideWish onAction={() => {}} />
            </div>
        </div>
    );
};
