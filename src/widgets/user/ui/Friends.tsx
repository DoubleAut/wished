'use client';

import { UserAvatar } from '@/entities/user/ui/User';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { UserSmallWidget, UserSmallWidgetSkeleton } from '.';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { PlainUser, UserWithFriends } from '@/shared/types/User';
import { RiEmotionUnhappyLine } from '@remixicon/react';

export const FriendsNavigation = ({
    currentPath,
    updateList,
}: {
    currentPath: 'followers' | 'followings';
    updateList: (flag: 'followers' | 'followings') => void;
}) => {
    const nav = ['followers', 'followings'] as const;
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
                        onClick={() => {
                            updateList(label);
                        }}
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

                    {currentPath === label && (
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

export const FriendsSearch = ({
    filterList,
}: {
    filterList: (query: string) => void;
}) => {
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
    currentList,
    user,
    onFollowAction,
}: {
    user: PlainUser;
    currentList: PlainUser[];
    onFollowAction: () => void;
}) => {
    const viewer = useViewerStore(state => state.user);

    if (!user) {
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
            {currentList.length === 0 && (
                <div className="flex w-full justify-center space-x-4 px-4 py-8">
                    <RiEmotionUnhappyLine />
                    <p>Nothing</p>
                </div>
            )}

            {currentList.map(user => (
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
                    links={<></>}
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
    user: UserWithFriends;
}

export const FriendsWidget = ({ user }: FriendsWidgetProps) => {
    const [currentPath, setCurrentPath] = useState<'followers' | 'followings'>(
        'followers',
    );
    const [currentList, setCurrentList] = useState<PlainUser[]>(user.followers);

    const updateCurrentList = (flag: 'followers' | 'followings') => {
        if (flag === 'followers') {
            setCurrentPath(flag);
            setCurrentList(user.followers);
        }

        if (flag === 'followings') {
            setCurrentPath(flag);
            setCurrentList(user.followings);
        }
    };

    const filterList = (query: string) => {
        const currentList =
            currentPath === 'followers' ? user.followers : user.followings;

        if (query.length > 0) {
            setCurrentList(
                currentList.filter(user =>
                    [
                        user.name.toLocaleLowerCase(),
                        user.surname.toLocaleLowerCase(),
                    ]
                        .join(' ')
                        .includes(query.trim().toLocaleLowerCase()),
                ),
            );
        }

        if (query.length === 0) {
            setCurrentList(user[currentPath]);
        }
    };

    return (
        <div className="container flex flex-col items-center gap-4 rounded border py-4">
            <FriendsNavigation
                currentPath={currentPath}
                updateList={updateCurrentList}
            />
            <FriendsSearch filterList={filterList} />
            <FriendsList
                user={user}
                currentList={currentList}
                onFollowAction={() => {}}
            />
        </div>
    );
};
