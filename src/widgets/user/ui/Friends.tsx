'use client';

import { UserAvatar } from '@/entities/user/ui/User';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChangeEvent, ReactNode, useState } from 'react';
import { useStore } from 'zustand';
import { UserSmallWidget, UserSmallWidgetSkeleton } from '.';
import {
    friendsStore,
    updateCurrentList,
} from '../../../entities/viewer/model/viewerFriendsStore';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { RiEmotionUnhappyLine } from '@remixicon/react';

export const FriendsNavigation = () => {
    const nav = ['followers', 'followings'] as const;
    const store = useStore(friendsStore);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    return (
        <div className="flex items-center justify-center">
            {nav.map(label => (
                <div
                    key={label}
                    className="relative h-10 px-4 py-2"
                    onMouseOver={() => setHoveredNav(label)}
                    onMouseLeave={() => setHoveredNav(null)}
                >
                    <button
                        className="z-20 cursor-pointer uppercase"
                        onClick={() => updateCurrentList(label)}
                    >
                        {label}
                    </button>

                    {hoveredNav === label && (
                        <motion.span
                            layoutId="hover_friends"
                            className="absolute inset-0 -z-10 rounded bg-accent"
                            transition={{
                                stiffness: 200,
                                damping: 15,
                                mass: 0.2,
                                duration: 0.2,
                            }}
                        />
                    )}

                    {store.currentPath === label && (
                        <motion.span
                            layoutId="active_friends"
                            className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-white"
                            transition={{
                                stiffness: 200,
                                damping: 15,
                                mass: 0.1,
                                duration: 0.2,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export const FriendsSearch = () => {
    const { filterList } = useStore(friendsStore);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        filterList(e.target.value);
    };

    return (
        <div className="flex w-full items-center space-x-2">
            <Input onChange={onChange} placeholder="Find friends" />
        </div>
    );
};

export const FriendsList = ({
    onFollowAction,
}: {
    onFollowAction: () => void;
}) => {
    const viewer = useViewerStore(state => state.user);
    const store = useStore(friendsStore);

    if (!store.user) {
        return (
            <div className="w-full space-y-4">
                <UserSmallWidgetSkeleton />
                <UserSmallWidgetSkeleton />
                <UserSmallWidgetSkeleton />
                <UserSmallWidgetSkeleton />
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {store.currentList.length === 0 && (
                <div className="flex w-full justify-center space-x-4 px-4 py-8">
                    <RiEmotionUnhappyLine />
                    <p>Nothing</p>
                </div>
            )}

            {store.currentList.map(user => (
                <UserSmallWidget
                    key={user.id}
                    avatar={
                        <UserAvatar
                            href={user.picture ?? 'avatar_not_found.png'}
                        />
                    }
                    header={
                        <Button asChild variant="link">
                            <Link href={`/users/${user.id}`} className="w-fit">
                                {user.name} {user.surname}
                            </Link>
                        </Button>
                    }
                    links={
                        <Button asChild variant="link">
                            <Link href={`/users/${user.id}`} className="w-fit">
                                {user.wishes.length} wishes
                            </Link>
                        </Button>
                    }
                    more={
                        viewer?.id !== user.id ? (
                            <FriendButton
                                friendId={user.id}
                                onAction={onFollowAction}
                            />
                        ) : null
                    }
                />
            ))}
        </div>
    );
};

interface FriendsWidgetProps {
    navigation: ReactNode;
    search: ReactNode;
    users: ReactNode;
}

export const FriendsWidget = ({
    navigation,
    search,
    users,
}: FriendsWidgetProps) => {
    return (
        <div className="container flex flex-col items-center gap-4 rounded border py-4">
            {navigation}
            {search}
            {users}
        </div>
    );
};
