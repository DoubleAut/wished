'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { getUser } from '@/entities/user/lib/user';
import { setInitialUser, userStore } from '@/entities/user/model/user';
import { UserAvatar, UserInitials } from '@/entities/user/ui/User';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserWidget } from '@/widgets/user/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useStore } from 'zustand';

interface Props {
    params: {
        id: number;
    };
}

const Home = ({ params: { id } }: Props) => {
    const store = useStore(userStore);
    const viewer = useViewerStore(state => state.user);
    const router = useRouter();

    useLayoutEffect(() => {
        setInitialUser(id);

        if (viewer?.id === Number(id)) {
            router.push('/profile');
        }
    }, []);

    if (!store.user) {
        return (
            <UserWidget
                avatar={<Skeleton />}
                initials={<Skeleton />}
                links={
                    <div className="flex space-x-2">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                }
            />
        );
    }

    const onFollowAction = async () => {
        const updatedUser = await getUser(id);

        store.setUser(updatedUser);
    };

    return (
        <div className="container flex flex-col space-y-4">
            <UserWidget
                avatar={
                    <UserAvatar
                        href={store.user.picture ?? 'avatar_not_found.png'}
                    />
                }
                initials={
                    <UserInitials
                        name={store.user.name}
                        surname={store.user.surname}
                    />
                }
                links={
                    <div className="flex space-x-2">
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link
                                className="flex gap-1"
                                href={`/users/${store.user.id}/friends`}
                            >
                                <p className="font-bold">
                                    {store.user.followings.length}
                                </p>
                                <p className="text-neutral-500">followings</p>
                            </Link>
                        </Button>
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link
                                className="flex gap-1"
                                href={`/users/${store.user.id}/friends`}
                            >
                                <p className="font-bold">
                                    {store.user.followers.length}
                                </p>
                                <p className="text-neutral-500">followers</p>
                            </Link>
                        </Button>
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link className="flex gap-1" href="/wishes">
                                <p className="font-bold">
                                    {store.user.wishes.length}
                                </p>
                                <p className="text-neutral-500">wishes</p>
                            </Link>
                        </Button>
                    </div>
                }
                follow={
                    <FriendButton
                        friendId={store.user.id}
                        onAction={onFollowAction}
                    />
                }
            />
            <Wishes wishes={store.user.wishes} />
        </div>
    );
};

export default Home;
