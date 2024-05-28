'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Background } from '@/entities/wish/ui/WishCard';
import { dialogStore } from '@/features/wish/model/dialogView';
import { Wish } from '@/shared/types/Wish';
import { Typography } from '@/shared/ui/Text/typography';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useStore } from 'zustand';

interface Props {
    wish: Wish;
    actions: ReactNode;
}

/**
 * WishContent is a component, that is being rendered inside of WishDialog. Current content displayed only if dialogStore has 'view' state.
 *
 * @param actions - Box with buttons. May vary depends on which Wish is it. If Wish is your own, displays own wish logic buttons, otherwise wish is not users, which has different logic buttons.
 *
 * @returns dialog component with wish and its controls
 */

export const WishContentSkeleton = () => (
    <div className="flex h-full flex-col items-start gap-6 rounded-lg p-6 md:flex-row">
        <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-lg md:w-1/2">
            <Skeleton className="inset-0" />
        </div>
        <div className="flex h-full flex-1 flex-col justify-between space-y-4">
            <h3 className="text-2xl font-bold">
                <Skeleton />
            </h3>
            <div className="flex gap-2">
                <Badge variant="outline">
                    <Skeleton />
                </Badge>
                <Badge variant="outline">
                    <Skeleton />
                </Badge>
            </div>
            <p className="text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                <Skeleton />
            </p>
            <div className="text-3xl font-bold">
                <Skeleton />
            </div>
            <Skeleton />
        </div>
    </div>
);

export const WishContent = ({ actions }: Props) => {
    const store = useStore(dialogStore);
    const viewerId = useViewerStore(state => state.user?.id);
    const wish = store.dialogWish as Wish;
    const isBadgesVisible = viewerId === wish.owner.id;

    if (!wish) {
        return <WishContentSkeleton />;
    }

    return (
        <div className="flex h-full flex-col gap-8 rounded-lg p-6 md:flex-row">
            <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-lg md:w-1/2">
                {wish.picture ? (
                    <Image
                        className="object-cover"
                        src={wish.picture}
                        alt={wish.title}
                        fill
                    />
                ) : (
                    <Background isHover={false} text={wish.title} />
                )}
            </div>
            <div className="flex flex-col justify-between gap-4">
                <Typography variant="h3">{wish.title}</Typography>
                {isBadgesVisible && (
                    <div className="flex gap-2">
                        <Badge variant="outline">
                            {wish.isHidden ? 'Hidden' : 'Not hidden'}
                        </Badge>
                        <Badge variant="outline">
                            {wish.canBeAnon ? 'Can be anon' : 'Cannot be anon'}
                        </Badge>
                    </div>
                )}
                <Typography variant="paragraph">{wish.description}</Typography>
                <Typography variant="h3" className="self-end">
                    ${wish.price}
                </Typography>
                {actions}
            </div>
        </div>
    );
};
