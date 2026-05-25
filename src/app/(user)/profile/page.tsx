'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { UserAvatar } from '@/entities/user/ui/User';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
    RiGroupLine,
    RiHandbagLine,
    RiShareLine,
    RiStarLine,
    RiUserFollowLine,
    RiUserHeartLine,
} from '@remixicon/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

import { useWishes } from '@/entities/wish/model/useWishes';
import { PersonalWishActions } from '@/entities/wish/ui/PersonalActions';
import { WishCard, WishCardSkeleton } from '@/entities/wish/ui/WishCard';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { PaginatedWishes } from '@/entities/wish/ui/WishesPaginated';
import { WishContent } from '@/widgets/wishes/ui/WishContent';

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
            className="border-accent/20 bg-card hover:border-accent/30 group flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
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
        <div className="relative">
            <div className="bg-muted h-24 w-24 animate-pulse rounded-full sm:h-28 sm:w-28" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
            ))}
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
    </div>
);

const ProfileWishesList = () => {
    const { wishes, pagination, setPage, isLoading } = useWishes('wishes');

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <WishCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (wishes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <RiStarLine className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-foreground text-lg font-semibold">
                        Your wishlist is waiting
                    </h3>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        Add something you'd love to receive. A wishlist is the
                        best way to give gift ideas to friends and family.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishes.map(wish => (
                    <WishDialog
                        key={wish.id}
                        wish={wish}
                        trigger={<WishCard wish={wish} />}
                        content={
                            <WishContent
                                wish={wish}
                                actions={<PersonalWishActions key={wish.id} />}
                            />
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};

export const ProfilePage = () => {
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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6">
            {/* Profile header */}
            <motion.div
                className="flex flex-col items-center gap-6"
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
                    <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
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
                        onClick={handleShareProfile}
                        aria-label="Share profile"
                    >
                        <RiShareLine className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2 rounded-lg"
                        asChild
                    >
                        <Link href="/friends">
                            <RiGroupLine className="h-4 w-4" />
                            Manage friends
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
                className="via-accent/20 h-px w-full bg-gradient-to-r from-transparent to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ transformOrigin: 'center' }}
            />

            {/* Wishes section */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.45,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                <div className="mb-4 flex items-center gap-2">
                    <RiStarLine className="text-accent h-5 w-5" />
                    <h2 className="text-foreground text-lg font-semibold">
                        My wishes
                    </h2>
                </div>
                <ProfileWishesList />
            </motion.div>
        </div>
    );
};

export default ProfilePage;
