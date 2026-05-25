'use client';

import { UserAvatar } from '@/entities/user/ui/User';
import { Input } from '@/shared/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { UserSmallWidgetSkeleton } from '.';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { Button } from '@/shared/ui/button';
import {
    RiGiftLine,
    RiSearchLine,
    RiUserFollowLine,
    RiUserHeartLine,
} from '@remixicon/react';
import { PlainUser, UserWithFriends } from '../../../../shared/types/User';

// ─── Tab Navigation ───────────────────────────────────────────────────────────

interface FriendsNavigationProps {
    currentPath: 'followers' | 'followings';
    updateList: (flag: 'followers' | 'followings') => void;
}

export const FriendsNavigation = ({
    currentPath,
    updateList,
}: FriendsNavigationProps) => {
    const tabs = [
        {
            key: 'followers' as const,
            label: 'Followers',
            icon: RiUserHeartLine,
        },
        {
            key: 'followings' as const,
            label: 'Following',
            icon: RiUserFollowLine,
        },
    ];

    return (
        <div className="bg-muted/50 flex items-center gap-1 rounded-full p-1">
            {tabs.map(({ key, label, icon: Icon }) => {
                const isActive = currentPath === key;

                return (
                    <Button
                        key={key}
                        type="button"
                        onClick={() => updateList(key)}
                        className={`
                            relative flex flex-1 items-center justify-center gap-2
                            rounded-lg px-4 py-2.5 text-sm font-medium
                            transition-colors duration-200
                            ${
                                isActive
                                    ? 'text-accent-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }
                        `}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="friends-tab-active"
                                className="bg-accent absolute inset-0 rounded-lg shadow-sm"
                                transition={{
                                    type: 'spring',
                                    stiffness: 380,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
};

// ─── Search ────────────────────────────────────────────────────────────────────

interface FriendsSearchProps {
    filterList: (query: string) => void;
    currentPath: 'followers' | 'followings';
}

export const FriendsSearch = ({
    filterList,
    currentPath,
}: FriendsSearchProps) => {
    const [focused, setFocused] = useState(false);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        filterList(e.target.value);
    };

    return (
        <div
            className={`
                bg-background relative flex w-full items-center rounded-xl
                border transition-all duration-200
                ${
                    focused
                        ? 'border-accent ring-accent/20 ring-2'
                        : 'border-border'
                }
            `}
        >
            <RiSearchLine className="text-muted-foreground ml-3 h-4 w-4 shrink-0" />
            <Input
                onChange={onChange}
                placeholder={`Search ${currentPath}...`}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="border-0 bg-transparent pl-2 shadow-none focus-visible:ring-0"
            />
        </div>
    );
};

// ─── Empty State ───────────────────────────────────────────────────────────────

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
                className="flex flex-col items-center gap-3 px-4 py-16 text-center"
            >
                <div className="bg-(--color-accent-subtle) flex h-14 w-14 items-center justify-center rounded-full">
                    <RiSearchLine className="text-accent h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-foreground text-base font-semibold">
                        No results found
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Try a different name or spelling
                    </p>
                </div>
            </motion.div>
        );
    }

    const content =
        type === 'followers'
            ? {
                  icon: RiUserHeartLine,
                  title: 'No followers yet',
                  description: 'Share your profile to grow your circle',
              }
            : {
                  icon: RiGiftLine,
                  title: 'Not following anyone',
                  description: 'Find friends and discover their wishlists',
              };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 px-4 py-16 text-center"
        >
            <div className="bg-(--color-accent-subtle) flex h-14 w-14 items-center justify-center rounded-full">
                <content.icon className="text-accent h-6 w-6" />
            </div>
            <div className="space-y-1">
                <p className="text-foreground text-base font-semibold">
                    {content.title}
                </p>
                <p className="text-muted-foreground text-sm">
                    {content.description}
                </p>
            </div>
        </motion.div>
    );
};

// ─── Friend Card ───────────────────────────────────────────────────────────────

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
                duration: 0.3,
                delay: index * 0.04,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className="border-accent/20 bg-card hover:border-accent/30 group relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all duration-200 hover:shadow-md"
        >
            {/* Avatar */}
            <Link href={`/users/${user.id}`} className="shrink-0">
                <div className="ring-border/40 group-hover:ring-accent/40 relative h-12 w-12 overflow-hidden rounded-full ring-2 transition-all duration-200">
                    <UserAvatar
                        href={user.picture ?? undefined}
                        className="h-full w-full object-cover"
                    />
                </div>
            </Link>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col">
                <Link
                    href={`/users/${user.id}`}
                    className="text-foreground hover:text-accent truncate text-sm font-semibold transition-colors"
                >
                    {displayName}
                </Link>
                <p className="text-muted-foreground truncate text-xs">
                    @{user.username}
                </p>
            </div>

            {/* Action */}
            <div className="shrink-0">
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

// ─── Friends List ──────────────────────────────────────────────────────────────

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
                <UserSmallWidgetSkeleton />
                <UserSmallWidgetSkeleton />
                <UserSmallWidgetSkeleton />
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

// ─── Friends Widget (Main) ─────────────────────────────────────────────────────

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
        <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6 sm:px-0">
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

            {/* Tab Navigation */}
            <FriendsNavigation
                currentPath={currentPath}
                updateList={updateCurrentList}
            />

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
