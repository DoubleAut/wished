'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { cn } from '@/shared/lib/classNames/cn';
import { Typography } from '@/shared/ui/Text/typography';
import { Badge } from '@/shared/ui/badge';
import {
    RiArchiveLine,
    RiEyeLine,
    RiEyeOffLine,
    RiGiftLine,
    RiHandbagLine,
    RiStarLine,
    RiStarSFill,
} from '@remixicon/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Wish } from '../../../../shared/types/Wish';

const statusConfig: Record<
    Wish['status'],
    { icon: typeof RiStarLine; label: string; className: string }
> = {
    active: {
        icon: RiStarSFill,
        label: 'Active',
        className:
            'bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent',
    },
    reserved: {
        icon: RiGiftLine,
        label: 'Reserved',
        className:
            'bg-warning/15 text-warning dark:bg-warning/20 dark:text-warning',
    },
    gifted: {
        icon: RiHandbagLine,
        label: 'Gifted',
        className:
            'bg-success/15 text-success dark:bg-success/20 dark:text-success',
    },
    archived: {
        icon: RiArchiveLine,
        label: 'Archived',
        className:
            'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground',
    },
};

export const Badges = ({ wish }: { wish: Wish }) => {
    const viewer = useViewerStore(state => state.user);
    const isReservedByViewer =
        wish.reservedBy && wish.reservedBy === viewer?.id;
    const isHidden = viewer?.id === wish.ownerId && wish.isHidden;
    const isOwnPresent = wish.ownerId === viewer?.id;
    const status = wish.status ?? 'active';
    const config = statusConfig[status] ?? statusConfig.active;
    const StatusIcon = config.icon;

    return (
        <div className="flex flex-wrap gap-1.5">
            <Badge
                className={cn(
                    'flex items-center gap-1 rounded-full border-0 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                    config.className,
                )}
            >
                <StatusIcon className="h-3 w-3" />
                {config.label}
            </Badge>
            {isHidden && (
                <Badge className="bg-foreground/10 text-foreground/60 rounded-full border-0 p-1">
                    <RiEyeOffLine className="h-3 w-3" />
                </Badge>
            )}
            {!isHidden && isOwnPresent && (
                <Badge className="bg-foreground/10 text-foreground/60 rounded-full border-0 p-1">
                    <RiEyeLine className="h-3 w-3" />
                </Badge>
            )}
            {isReservedByViewer && (
                <Badge className="bg-accent/15 text-accent rounded-full border-0 p-1">
                    <RiGiftLine className="h-3 w-3" />
                </Badge>
            )}
        </div>
    );
};

export const Background = ({
    isHover,
    text,
}: {
    text: string;
    isHover: boolean;
}) => {
    return (
        <div className="from-(--color-accent-subtle) to-accent/30 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
            <div className="flex flex-col items-center gap-2">
                <div className="bg-background/60 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm">
                    <RiGiftLine className="text-accent/60 h-6 w-6" />
                </div>
                <p className="text-foreground/50 line-clamp-2 max-w-[80%] text-center text-xs font-medium">
                    {text}
                </p>
            </div>
        </div>
    );
};

export const WishCardSkeleton = () => (
    <div className="bg-card ring-border/50 relative overflow-hidden rounded-xl shadow-sm ring-1">
        <div className="bg-muted aspect-[4/3] w-full animate-pulse" />
        <div className="space-y-2 p-4">
            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
        </div>
    </div>
);

export const WishCard = ({ wish }: { wish: Wish }) => {
    const [isHover, setHover] = useState(false);
    const viewer = useViewerStore(state => state.user);
    const isOwn = wish.ownerId === viewer?.id;
    const isReservedByViewer =
        wish.reservedBy && wish.reservedBy === viewer?.id;

    return (
        <motion.div
            className="bg-card ring-accent/20 group relative h-full w-full overflow-hidden rounded-2xl shadow-sm ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            whileTap={{ scale: 0.98 }}
        >
            {/* Image area */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {wish.picture ? (
                    <motion.div
                        className="relative h-full w-full"
                        animate={{ scale: isHover ? 1.08 : 1 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Image
                            className="object-cover"
                            src={wish.picture}
                            alt={wish.title}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            fill
                        />
                    </motion.div>
                ) : (
                    <Background isHover={isHover} text={wish.title} />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status badges - top */}
                <div className="absolute left-3 top-3">
                    <Badges wish={wish} />
                </div>

                {/* Price pill - bottom left */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-background/80 text-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                        ${wish.price}
                    </div>
                </div>

                {/* Reserved indicator */}
                {isReservedByViewer && (
                    <div className="absolute bottom-3 right-3">
                        <div className="bg-accent/90 text-accent-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                            <RiGiftLine className="h-3 w-3" />
                            Yours
                        </div>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="space-y-1.5 p-4">
                <div className="flex items-start justify-between gap-2">
                    <Typography
                        variant="h6"
                        className="text-foreground line-clamp-1 font-semibold"
                    >
                        {wish.title}
                    </Typography>
                </div>
                {wish.description && (
                    <Typography
                        variant="paragraph"
                        className="text-muted-foreground line-clamp-2 text-[13px] leading-relaxed"
                    >
                        {wish.description}
                    </Typography>
                )}
                {wish.giftDay && (
                    <div className="flex items-center gap-1.5 pt-1">
                        <RiGiftLine className="text-muted-foreground/60 h-3 w-3" />
                        <span className="text-muted-foreground/60 text-[11px]">
                            {new Date(wish.giftDay).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Hover action hint */}
            <div
                className={cn(
                    'bg-foreground/5 absolute inset-0 flex items-center justify-center rounded-xl opacity-0 backdrop-blur-[1px] transition-opacity duration-300',
                    isHover && 'opacity-100',
                )}
            >
                <div className="flex flex-col items-center gap-1.5">
                    <div className="bg-background/80 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm">
                        {isOwn ? (
                            <RiStarLine className="text-foreground/70 h-5 w-5" />
                        ) : (
                            <RiGiftLine className="text-accent h-5 w-5" />
                        )}
                    </div>
                    <span className="text-foreground/70 text-xs font-medium">
                        {isOwn ? 'View details' : 'See gift'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
