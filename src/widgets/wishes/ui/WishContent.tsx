'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { statusConfig } from '@/entities/wish/lib/statusConfig';
import { Background } from '@/entities/wish/ui/WishCard';
import { dialogStore } from '@/features/wish/model/dialogView';
import { cn } from '@/shared/lib/classNames/cn';
import { Typography } from '@/shared/ui/Text/typography';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { RiCalendarLine, RiPriceTag3Line } from '@remixicon/react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useStore } from 'zustand';
import { Wish } from '../../../../shared/types/Wish';

/**
 * WishContent is rendered inside WishDialog when dialogStore is in 'view' mode.
 * Shows the wish image, badges, description, price, and action buttons.
 */

export const WishContentSkeleton = () => (
    <div className="flex flex-col gap-6 p-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full rounded-xl" />
        </div>
    </div>
);

export const WishContent = ({
    wish,
    actions,
}: {
    wish: Wish;
    actions: ReactNode;
}) => {
    const categories = useViewerStore(state => state.categories);

    if (!wish) {
        return <WishContentSkeleton />;
    }

    const status = wish.status ?? 'active';
    const meta = statusConfig[status] ?? statusConfig.active;
    const StatusIcon = meta.icon;
    const categoryName = wish.categoryId
        ? categories.find(c => c.id === wish.categoryId)?.name
        : null;

    return (
        <div className="flex flex-col">
            {/* Full-bleed image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[16/10]">
                {wish.picture ? (
                    <Image
                        className="object-cover"
                        src={wish.picture}
                        alt={wish.title ?? 'Wish image'}
                        fill
                        sizes="(max-width: 640px) 100vw, 600px"
                        priority
                    />
                ) : (
                    <Background isHover={false} text={wish.title ?? 'Wish'} />
                )}
                <div className="from-background via-background/10 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6 px-4 pb-8 pt-4 sm:px-6">
                {/* Title & status */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <Typography
                            variant="h3"
                            className="text-foreground font-bold"
                        >
                            {wish.title}
                        </Typography>
                        <div
                            className={cn(
                                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                                meta.className,
                            )}
                        >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {meta.label}
                        </div>
                    </div>

                    {/* Meta row */}
                    <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5">
                            <RiPriceTag3Line className="h-4 w-4" />
                            <span className="text-foreground font-semibold">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                }).format(wish.price)}
                            </span>
                        </div>
                        {wish.giftDay && (
                            <div className="flex items-center gap-1.5">
                                <RiCalendarLine className="h-4 w-4" />
                                <span>
                                    {new Date(wish.giftDay).toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        },
                                    )}
                                </span>
                            </div>
                        )}
                        {categoryName && (
                            <div className="flex items-center gap-1.5">
                                <RiPriceTag3Line className="h-4 w-4" />
                                <span>{categoryName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {wish.description && (
                    <div className="bg-secondary/50 rounded-xl p-4">
                        <Typography
                            variant="paragraph"
                            className="text-muted-foreground leading-relaxed"
                        >
                            {wish.description}
                        </Typography>
                    </div>
                )}

                {/* Owner badges */}
                <WishContent.Badges />

                {/* Actions */}
                <div className="pt-2">{actions}</div>
            </div>
        </div>
    );
};

WishContent.Badges = () => {
    const viewerId = useViewerStore(state => state.user?.id);
    const store = useStore(dialogStore);
    const wish = store.dialogWish;
    const isBadgesVisible = viewerId === wish?.ownerId;

    if (!wish || !isBadgesVisible) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Badge
                variant="outline"
                className="border-border/50 gap-1.5 text-xs"
            >
                <span
                    className={cn(
                        'h-2 w-2 rounded-full',
                        wish.isHidden ? 'bg-destructive' : 'bg-success',
                    )}
                />
                {wish.isHidden ? 'Hidden from others' : 'Visible to others'}
            </Badge>
            <Badge
                variant="outline"
                className="border-border/50 gap-1.5 text-xs"
            >
                <span
                    className={cn(
                        'h-2 w-2 rounded-full',
                        wish.canBeAnon ? 'bg-success' : 'bg-muted-foreground',
                    )}
                />
                {wish.canBeAnon ? 'Anonymous allowed' : 'Named only'}
            </Badge>
        </div>
    );
};
