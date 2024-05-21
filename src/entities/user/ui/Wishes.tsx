import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Wish as WishType } from '@/shared/types/Wish';
import { Subheader } from '@/shared/ui/Text/subheader';
import { Skeleton } from '@/shared/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

export const Wishes = ({ subheader }: { subheader: string }) => {
    const user = useViewerStore(state => state.user);

    if (!user) {
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
        <div className="flex flex-col gap-3">
            <Subheader>{subheader}</Subheader>
            <div className="grid grid-cols-4 gap-3">
                {user.wishes.map(item => (
                    <Wish key={item.id} wish={item} />
                ))}
            </div>
        </div>
    );
};

export const Wish = ({ wish }: { wish: WishType }) => (
    <div className="aspect-square rounded-md bg-slate-500 p-1">
        <div className="relative">
            {wish.picture && (
                <>
                    <div className="relative aspect-square w-full">
                        <Image
                            className="object-contain"
                            src={wish.picture}
                            alt="Wish picture"
                            fill
                        />
                    </div>
                    <div className="absolute right-0 top-0">
                        <MoreHorizontal />
                    </div>
                </>
            )}
        </div>
        <div className="flex flex-col gap-2 text-white">
            <p className="text-md font-bold">{wish.title}</p>
            <p className="text-sm">{wish.price}</p>
        </div>
    </div>
);
