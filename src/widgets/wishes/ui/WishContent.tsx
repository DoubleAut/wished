'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Background } from '@/entities/wish/ui/WishCard';
import {
    PersonalWishActions,
    UserWishActions,
} from '@/entities/wish/ui/Wishes';
import { dialogStore } from '@/features/wish/model/dialogView';
import { Typography } from '@/shared/ui/Text/typography';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import Image from 'next/image';
import { PropsWithChildren, ReactNode } from 'react';
import { useStore } from 'zustand';
import { Wish } from '../../../../shared/types/Wish';

interface Props extends PropsWithChildren {
    wish: Wish;
    actions: ReactNode;
    picture: ReactNode;
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

export const WishContent = () => {
    const store = useStore(dialogStore);
    const wish = store.dialogWish;

    if (!wish) {
        return <WishContentSkeleton />;
    }

    return (
        <AspectRatio
            ratio={6 / 3}
            className="grid h-fit gap-4 md:grid-rows-2 md:flex-row"
        >
            <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg">
                <WishContent.Image />
            </div>
            <div className="flex h-fit w-full flex-col gap-4">
                <WishContent.Badges />

                <Typography variant="paragraph">{wish.description}</Typography>
                <Typography variant="h3" className="self-end">
                    ${wish.price}
                </Typography>

                <WishContent.Actions />
            </div>
        </AspectRatio>
    );
};

WishContent.Image = () => {
    const store = useStore(dialogStore);
    const wish = store.dialogWish;

    if (!wish) {
        return (
            <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-lg">
                <Skeleton className="object-cover" />
            </div>
        );
    }

    if (!wish.picture) {
        return (
            <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-lg">
                <Background isHover={false} text={wish.title ?? 'Wish'} />
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-lg">
            <Image
                className="object-cover"
                src={wish.picture}
                alt={wish.title ?? 'Wish image'}
                fill
            />
        </div>
    );
};

WishContent.Badges = () => {
    const viewerId = useViewerStore(state => state.user?.id);
    const store = useStore(dialogStore);
    const wish = store.dialogWish;
    const isBadgesVisible = viewerId === wish?.ownerId ?? false;

    if (!wish || !isBadgesVisible) {
        return null;
    }

    return (
        <div className="flex gap-2">
            <Badge variant="outline">
                {wish.isHidden ? 'Hidden' : 'Not hidden'}
            </Badge>
            <Badge variant="outline">
                {wish.canBeAnon ? 'Can be anon' : 'Cannot be anon'}
            </Badge>
        </div>
    );
};

WishContent.Actions = () => {
    const viewerId = useViewerStore(state => state.user?.id);
    const store = useStore(dialogStore);
    const wish = store.dialogWish;

    if (!wish || !wish.ownerId) {
        return null;
    }

    if (wish.ownerId === viewerId) {
        return <PersonalWishActions key={wish.id} />;
    }

    return <UserWishActions key={wish.id} />;
};
