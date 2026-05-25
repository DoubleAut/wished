'use client';

import { UserAvatar } from '@/entities/user/ui/User';
import { Input } from '@/shared/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
    RiCloseLine,
    RiGiftLine,
    RiSearchLine,
    RiUserAddLine,
    RiUserFollowLine,
    RiUserHeartLine,
} from '@remixicon/react';
import { PlainUser, UserWithFriends } from '../../../../shared/types/User';

// ─── Noise overlay (scoped to friends page) ──────────────────────────────────

const noiseSvg =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")";

// ─── Search ──────────────────────────────────────────────────────────────────

interface FriendsSearchProps {
    filterList: (query: string) => void;
    currentPath: 'followers' | 'followings';
}

export const FriendsSearch = ({
    filterList,
    currentPath,
}: FriendsSearchProps) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        setValue(newValue);
        filterList(newValue);
    };

    const onClear = () => {
        setValue('');
        filterList('');
    };

    return (
        <div
            className={`
                relative flex w-full items-center transition-all duration-300 ease-out
                ${focused ? 'text-accent' : 'text-muted-foreground'}
            `}
        >
            <RiSearchLine className="pointer-events-none absolute left-3 h-4 w-4" />
            <Input
                value={value}
                onChange={onChange}
                placeholder={`Search ${currentPath}...`}
                aria-label={`Search ${currentPath}`}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="bg-card placeholder:text-muted-foreground/50 pl-9 pr-9"
            />
            <AnimatePresence>
                {value.length > 0 && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 0.8 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClear}
                        aria-label="Clear search"
                        className="text-muted-foreground hover:text-foreground absolute right-3 flex h-4 w-4 items-center justify-center transition-colors"
                    >
                        <RiCloseLine className="h-4 w-4" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
    type: 'followers' | 'followings';
    query?: string;
}

const EmptyState = ({ type, query }: EmptyStateProps) => {
    const isSearch = !!query;

    if (isSearch) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 px-4 py-20 text-center"
            >
                <div className="bg-accent-subtle flex h-16 w-16 items-center justify-center rounded-full">
                    <RiSearchLine className="text-accent h-7 w-7" />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-foreground text-base font-semibold">
                        No results found
                    </p>
                    <p className="text-muted-foreground max-w-[220px] text-sm">
                        Try a different name or spelling
                    </p>
                </div>
            </motion.div>
        );
    }

    if (type === 'followers') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 px-4 py-20 text-center"
            >
                <div className="bg-accent-subtle flex h-16 w-16 items-center justify-center rounded-full">
                    <RiUserHeartLine className="text-accent h-7 w-7" />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-foreground text-base font-semibold">
                        No followers yet
                    </p>
                    <p className="text-muted-foreground max-w-[240px] text-sm">
                        Share your profile to grow your circle
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 px-4 py-20 text-center"
        >
            <div className="bg-accent-subtle flex h-16 w-16 items-center justify-center rounded-full">
                <RiGiftLine className="text-accent h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-foreground text-base font-semibold">
                    Not following anyone
                </p>
                <p className="text-muted-foreground max-w-[240px] text-sm">
                    Find friends and discover their wishlists
                </p>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/u">
                    <RiUserAddLine className="h-4 w-4" />
                    Find Friends
                </Link>
            </Button>
        </motion.div>
    );
};

// ─── Friend Card ─────────────────────────────────────────────────────────────

interface FriendCardProps {
    user: PlainUser;
    viewerId?: string;
    onFollowAction: () => void;
    index: number;
}

const FriendCard = ({
    user,
    viewerId,
    onFollowAction,
    index,
}: FriendCardProps) => {
    const displayName =
        [user.name, user.surname].filter(Boolean).join(' ') || user.username;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: index * 0.03,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className="bg-card hover:border-accent/40 hover:bg-accent/[0.02] group relative flex items-center gap-4 rounded-xl border border-transparent p-3 shadow-sm transition-all duration-[250ms] ease-out hover:shadow-md"
        >
            {/* Avatar */}
            <Link
                href={`/users/${user.id}`}
                className="focus-visible:ring-ring/50 focus-visible:ring-offset-background shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                <Avatar className="ring-border/40 group-hover:ring-accent/50 relative h-12 w-12 overflow-hidden rounded-full ring-2 transition-all duration-300 ease-out">
                    <UserAvatar
                        href={user.picture ?? undefined}
                        className="h-full w-full object-cover"
                    />
                </Avatar>
            </Link>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col">
                <Link
                    href={`/users/${user.id}`}
                    className="text-foreground hover:text-accent focus-visible:ring-ring/50 focus-visible:ring-offset-background truncate rounded text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    {displayName}
                </Link>
                <p className="text-muted-foreground truncate text-xs">
                    @{user.username}
                </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
                {/* View Profile — visible on hover */}
                <Link
                    href={`/users/${user.id}`}
                    className="text-muted-foreground hover:text-accent focus-visible:ring-ring/50 rounded-lg p-1 opacity-0 transition-all duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 group-hover:opacity-100"
                    aria-label={`View ${displayName}'s profile`}
                >
                    <RiUserAddLine className="h-4 w-4" />
                </Link>

                {viewerId !== user.id ? (
                    <FriendButton
                        friendId={user.id}
                        onAction={onFollowAction}
                    />
                ) : null}
            </div>
        </motion.div>
    );
};

// ─── Friends List ────────────────────────────────────────────────────────────

interface FriendsListProps {
    currentList: PlainUser[];
    user: PlainUser;
    onFollowAction: () => void;
    currentPath: 'followers' | 'followings';
    query?: string;
}

export const FriendsList = ({
    currentList,
    user,
    onFollowAction,
    currentPath,
    query,
}: FriendsListProps) => {
    const viewer = useViewerStore(state => state.user);

    if (!user) {
        return (
            <div className="space-y-3">
                <FriendCardSkeleton />
                <FriendCardSkeleton />
                <FriendCardSkeleton />
            </div>
        );
    }

    if (currentList.length === 0) {
        return <EmptyState type={currentPath} query={query} />;
    }

    return (
        <div className="space-y-2">
            <AnimatePresence mode="popLayout">
                {currentList.map((friend, index) => (
                    <FriendCard
                        key={friend.id}
                        user={friend}
                        viewerId={viewer?.id}
                        onFollowAction={onFollowAction}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// ─── Friend Card Skeleton ────────────────────────────────────────────────────

const FriendCardSkeleton = () => (
    <div className="bg-card flex items-center gap-4 rounded-xl border border-transparent p-3 shadow-sm">
        <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
            <div className="bg-muted h-3.5 w-28 animate-pulse rounded" />
            <div className="bg-muted h-3 w-20 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-7 w-20 animate-pulse rounded-lg" />
    </div>
);

// ─── Friends Widget (Main) ───────────────────────────────────────────────────

interface FriendsWidgetProps {
    user: UserWithFriends;
}

export const FriendsWidget = ({ user }: FriendsWidgetProps) => {
    const [currentPath, setCurrentPath] = useState<'followers' | 'followings'>(
        'followers',
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [currentList, setCurrentList] = useState<PlainUser[]>(user.followers);

    const updateCurrentList = useCallback(
        (flag: 'followers' | 'followings') => {
            setCurrentPath(flag);
            setSearchQuery('');
            setCurrentList(
                flag === 'followers' ? user.followers : user.followings,
            );
        },
        [user.followers, user.followings],
    );

    const filterList = useCallback(
        (query: string) => {
            setSearchQuery(query);

            const source =
                currentPath === 'followers' ? user.followers : user.followings;

            if (query.length > 0) {
                const lowerQuery = query.trim().toLocaleLowerCase();

                setCurrentList(
                    source.filter(u =>
                        `${u.name} ${u.surname} ${u.username}`
                            .toLocaleLowerCase()
                            .includes(lowerQuery),
                    ),
                );
            } else {
                setCurrentList(source);
            }
        },
        [currentPath, user.followers, user.followings],
    );

    const counts = useMemo(
        () => ({
            followers: user.followers.length,
            followings: user.followings.length,
        }),
        [user.followers.length, user.followings.length],
    );

    return (
        <div className="mx-auto w-full max-w-xl space-y-5 px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                    Friends
                </h1>
                <p className="text-muted-foreground text-sm">
                    {counts.followers} follower
                    {counts.followers !== 1 ? 's' : ''}
                    {' · '}
                    {counts.followings} following
                </p>
            </div>

            {/* Segmented tab bar — clean underline style */}
            <div className="bg-muted/50 flex rounded-xl p-1">
                <button
                    type="button"
                    onClick={() => updateCurrentList('followers')}
                    className={`
                        relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                        ${
                            currentPath === 'followers'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }
                    `}
                >
                    <RiUserHeartLine className="h-4 w-4" />
                    <span>Followers</span>
                    <span
                        className={`
                            inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-none
                            ${
                                currentPath === 'followers'
                                    ? 'bg-accent/10 text-accent'
                                    : 'bg-muted text-muted-foreground'
                            }
                        `}
                    >
                        {counts.followers}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => updateCurrentList('followings')}
                    className={`
                        relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                        ${
                            currentPath === 'followings'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }
                    `}
                >
                    <RiUserFollowLine className="h-4 w-4" />
                    <span>Following</span>
                    <span
                        className={`
                            inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-none
                            ${
                                currentPath === 'followings'
                                    ? 'bg-accent/10 text-accent'
                                    : 'bg-muted text-muted-foreground'
                            }
                        `}
                    >
                        {counts.followings}
                    </span>
                </button>
            </div>

            {/* Search */}
            <FriendsSearch filterList={filterList} currentPath={currentPath} />

            {/* List */}
            <FriendsList
                user={user}
                currentList={currentList}
                onFollowAction={() => {}}
                currentPath={currentPath}
                query={searchQuery}
            />
        </div>
    );
};
