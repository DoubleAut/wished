'use client';

import { getUser } from '@/entities/user/lib/user';
import { UserAvatar } from '@/entities/user/ui/User';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
    RiGiftLine,
    RiGroupLine,
    RiShareLine,
    RiStarLine,
    RiUserFollowLine,
    RiUserHeartLine,
} from '@remixicon/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';
import { toast } from 'sonner';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { useUserWishes } from '@/entities/wish/model/useUserWishes';
import { UserWishActions } from '@/entities/wish/ui/UserWishActions';
import { WishCard, WishCardSkeleton } from '@/entities/wish/ui/WishCard';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { PaginatedWishes } from '@/entities/wish/ui/WishesPaginated';
import type { Wish } from '@/shared/types/Wish';
import { WishContent } from '@/widgets/wishes/ui/WishContent';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

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

const UserWishesList = ({ userId }: { userId: string }) => {
    const { wishes, pagination, setPage, isLoading } = useUserWishes(userId);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <WishCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (wishes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <RiGiftLine className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-foreground text-lg font-semibold">
                        No wishes yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        This user hasn't added any wishes to their list yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishes.map((wish: Wish) => (
                    <WishDialog
                        key={wish.id}
                        wish={wish}
                        trigger={<WishCard wish={wish} />}
                        content={
                            <WishContent
                                wish={wish}
                                actions={<UserWishActions key={wish.id} />}
                            />
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};

const Home = ({ params: paramsPromise }: Props) => {
    const { id } = use(paramsPromise);
    const viewer = useViewerStore(state => state.user);
    const isOwnProfile = viewer?.id === id;

    const { data: user, status: userStatus } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
    });

    const handleShareProfile = () => {
        const url = `${window.location.origin}/u/${user?.username ?? id}`;

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
            {/* Profile Header */}
            {userStatus === 'success' && user && (
                <motion.div
                    className="flex flex-col items-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {/* Avatar with glow */}
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
                            {[user.name, user.surname]
                                .filter(Boolean)
                                .join(' ') || user.username}
                        </h1>
                        {user.name && (
                            <p className="text-muted-foreground text-sm">
                                @{user.username}
                            </p>
                        )}
                    </motion.div>

                    {/* Stats row */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <StatPill
                            value={0}
                            label="Wishes"
                            icon={<RiStarLine className="h-3.5 w-3.5" />}
                            href={`/users/${id}`}
                            index={0}
                        />
                        <StatPill
                            value={0}
                            label="Followers"
                            icon={<RiUserHeartLine className="h-3.5 w-3.5" />}
                            href={`/users/${id}/friends`}
                            index={1}
                        />
                        <StatPill
                            value={0}
                            label="Following"
                            icon={<RiUserFollowLine className="h-3.5 w-3.5" />}
                            href={`/users/${id}/friends`}
                            index={2}
                        />
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
                        {!isOwnProfile && <FriendButton friendId={user.id} />}
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
                            <Link href={`/users/${id}/friends`}>
                                <RiGroupLine className="h-4 w-4" />
                                Friends
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            )}

            {userStatus === 'pending' && (
                <div className="flex flex-col items-center gap-6">
                    <Skeleton className="h-28 w-28 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-28 rounded-full" />
                        <Skeleton className="h-9 w-28 rounded-full" />
                        <Skeleton className="h-9 w-28 rounded-full" />
                    </div>
                </div>
            )}

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
                        {isOwnProfile ? 'My wishes' : 'Wishes'}
                    </h2>
                </div>
                <UserWishesList userId={id} />
            </motion.div>
        </div>
    );
};

export default Home;
