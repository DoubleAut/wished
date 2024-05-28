'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { UserAvatar, UserInitials } from '@/entities/user/ui/User';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserWidget } from '@/widgets/user/ui';
import Link from 'next/link';

export default function Home() {
    const user = useViewerStore(state => state.user);
    const followers = useViewerStore(state => state.followers);
    const followings = useViewerStore(state => state.followings);
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);

    if (!user) {
        return (
            <UserWidget
                avatar={<Skeleton />}
                initials={<Skeleton />}
                links={<Skeleton />}
                action={<Skeleton />}
            />
        );
    }

    return (
        <div className="container flex flex-col space-y-4">
            <UserWidget
                avatar={<UserAvatar href={user.picture} />}
                initials={
                    <UserInitials name={user.name} surname={user.surname} />
                }
                links={
                    <div className="flex space-x-2">
                        <Button variant="link">
                            <Link href={`/friends`}>
                                <p>{followings.length}</p>
                                <p>followings</p>
                            </Link>
                        </Button>
                        <Button variant="link">
                            <Link href={`/friends`}>
                                <p>{followers.length}</p>
                                <p>followers</p>
                            </Link>
                        </Button>
                        <Button variant="link">
                            <Link href={`/`}>
                                <p>{wishes.length}</p>
                                <p>wishes</p>
                            </Link>
                        </Button>
                        <Button variant="link">
                            <Link href={`/`}>
                                <p>{reservations.length}</p>
                                <p className="cursor-pointer">reserved</p>
                            </Link>
                        </Button>
                    </div>
                }
            />
            <Wishes wishes={wishes} />
        </div>
    );
}
