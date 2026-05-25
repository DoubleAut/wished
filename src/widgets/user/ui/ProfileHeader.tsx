'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { UserAvatar } from '@/entities/user/ui/User';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
    RiGroupLine,
    RiHandbagLine,
    RiNotificationLine,
    RiShareLine,
    RiStarLine,
    RiUserFollowLine,
    RiUserHeartLine,
} from '@remixicon/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

interface StatPillProps {
    value: number;
    label: string;
    icon: React.ReactNode;
    href: string;
    index: number;
}

const StatPill = ({ value, label, icon, href, index }: StatPillProps) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
            duration: 0.35,
            delay: 0.15 + index * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
        }}
    >
        <Link
            href={href}
            className="border-border/60 bg-card hover:border-accent/30 group flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
        >
            <span className="bg-accent/10 text-accent group-hover:bg-accent/20 group-hover:text-accent flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200">
                {icon}
            </span>
            <span className="flex items-baseline gap-1">
                <span className="text-foreground text-sm font-bold tabular-nums">
                    {value}
                </span>
                <span className="text-muted-foreground text-xs">{label}</span>
            </span>
        </Link>
    </motion.div>
);

// ─── Skeleton ───────────────────────────────────────────────────────────────────

export const ProfileHeaderSkeleton = () => (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 pt-8 sm:px-6 sm:pt-12">
        {/* Avatar */}
        <div className="relative">
            <div className="bg-muted h-24 w-24 animate-pulse rounded-full sm:h-28 sm:w-28" />
        </div>

        {/* Name */}
        <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
            ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
    </div>
);

// ─── Profile Header ─────────────────────────────────────────────────────────────

export const ProfileHeader = () => {
    const user = useViewerStore(state => state.user);
    const followers = useViewerStore(state => state.followers);
    const followings = useViewerStore(state => state.followings);
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);

    if (!user) {
        return <ProfileHeaderSkeleton />;
    }

    const displayName =
        [user.name, user.surname].filter(Boolean).join(' ') || user.username;

    const stats: StatPillProps[] = [
        {
            value: followings.length,
            label: 'Following',
            icon: <RiUserFollowLine className="h-3.5 w-3.5" />,
            href: '/friends',
            index: 0,
        },
        {
            value: followers.length,
            label: 'Followers',
            icon: <RiUserHeartLine className="h-3.5 w-3.5" />,
            href: '/friends',
            index: 1,
        },
        {
            value: wishes.length,
            label: 'Wishes',
            icon: <RiStarLine className="h-3.5 w-3.5" />,
            href: '/',
            index: 2,
        },
        {
            value: reservations.length,
            label: 'Reserved',
            icon: <RiHandbagLine className="h-3.5 w-3.5" />,
            href: '/',
            index: 3,
        },
    ];

    const handleShareProfile = () => {
        const url = `${window.location.origin}/u/${user.username}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success('Copied!');
            })
            .catch(() => {
                toast.error('Failed to copy link');
            });
    };

    return (
        <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 pt-8 sm:px-6 sm:pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Avatar with glow ring */}
            <motion.div
                className="relative"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.5,
                    delay: 0.05,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >
                <div className="bg-accent/20 absolute inset-0 rounded-full blur-xl" />
                <div className="relative">
                    <Avatar className="ring-accent/30 ring-offset-background h-24 w-24 ring-2 ring-offset-2 sm:h-28 sm:w-28">
                        <UserAvatar
                            href={user.picture ?? undefined}
                            className="h-full w-full object-cover"
                        />
                    </Avatar>
                </div>
            </motion.div>

            {/* Name & username */}
            <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                <h1 className="text-foreground font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    {displayName}
                </h1>
                {displayName !== user.username && (
                    <p className="text-muted-foreground text-sm">
                        @{user.username}
                    </p>
                )}
            </motion.div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-2">
                {stats.map(stat => (
                    <StatPill key={stat.label} {...stat} />
                ))}
            </div>

            {/* Action buttons */}
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="Notifications"
                >
                    <RiNotificationLine className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="gap-2 rounded-lg"
                    onClick={handleShareProfile}
                >
                    <RiShareLine className="h-4 w-4" />
                    Copy profile link
                </Button>
                <Button variant="outline" className="gap-2 rounded-lg" asChild>
                    <Link href="/friends">
                        <RiGroupLine className="h-4 w-4" />
                        Manage friends
                    </Link>
                </Button>
            </motion.div>
        </motion.div>
    );
};
