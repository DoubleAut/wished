'use client';

import { getUser } from '@/entities/user/lib/user';
import { UserAvatar, UserInitials } from '@/entities/user/ui/User';
import { getWishes } from '@/entities/wish/lib';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserWidget, UserWidgetSkeleton } from '@/widgets/user/ui';
import { useQuery } from '@tanstack/react-query';
interface Props {
    params: {
        id: string;
    };
}

const SkeletonPlaceholder = () => (
    <AspectRatio
        ratio={4 / 3}
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded"
    >
        <Skeleton className="h-full w-full" />
    </AspectRatio>
);

const Home = ({ params: { id } }: Props) => {
    const { data: user, status: userStatus } = useQuery({
        queryKey: ['user', id],
        queryFn: () => {
            return getUser(id);
        },
    });

    const { data: wishes, status: wishesStatus } = useQuery({
        queryKey: ['wishes', id],
        queryFn: () => {
            return getWishes(id);
        },
    });

    return (
        <div className="container flex flex-col space-y-4">
            {userStatus === 'success' && (
                <UserWidget
                    avatar={
                        <UserAvatar
                            href={user.picture ?? 'avatar_not_found.png'}
                        />
                    }
                    initials={
                        <UserInitials
                            username={id}
                            name={user.username}
                            surname={user.username ?? ''}
                        />
                    }
                    links={
                        <div className="flex space-x-2">
                            {/* 
                                <Button variant="link" className="px-0 py-0" asChild>
                                    <Link
                                        className="flex gap-1"
                                        href={`/users/${user.id}/friends`}
                                    >
                                        <p className="font-bold">
                                            {user.followings.length}
                                        </p>
                                        <p className="text-neutral-500">followings</p>
                                    </Link>
                                </Button>
                                <Button variant="link" className="px-0 py-0" asChild>
                                    <Link
                                        className="flex gap-1"
                                        href={`/users/${user.id}/friends`}
                                    >
                                        <p className="font-bold">
                                            {user.followers.length}
                                        </p>
                                        <p className="text-neutral-500">followers</p>
                                    </Link>
                                </Button>
                                <Button variant="link" className="px-0 py-0" asChild>
                                    <Link className="flex gap-1" href="/wishes">
                                        <p className="font-bold">{wishes.length}</p>
                                        <p className="text-neutral-500">wishes</p>
                                    </Link>
                                </Button>
                            */}
                        </div>
                    }
                    follow={<FriendButton friendId={user.id} />}
                />
            )}

            {userStatus === 'pending' && <UserWidgetSkeleton />}

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {wishesStatus === 'success' && wishes && (
                    <Wishes wishes={wishes} />
                )}
                {wishesStatus === 'pending' && <SkeletonPlaceholder />}
            </div>
        </div>
    );
};

export default Home;
