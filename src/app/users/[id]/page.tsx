import { getUser } from '@/entities/user/lib/user';
import { UserAvatar, UserInitials } from '@/entities/user/ui/User';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { FriendButton } from '@/features/user/ui/FriendButton';
import { Button } from '@/shared/ui/button';
import { UserWidget } from '@/widgets/user/ui';
import Link from 'next/link';

interface Props {
    params: {
        id: number;
    };
}

export default async function Home({ params: { id } }: Props) {
    const user = await getUser(id);

    return (
        <div className="container flex flex-col space-y-4">
            <UserWidget
                avatar={
                    <UserAvatar href={user.picture ?? 'avatar_not_found.png'} />
                }
                initials={
                    <UserInitials name={user.name} surname={user.surname} />
                }
                links={
                    <div className="flex space-x-2">
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link className="flex gap-1" href="/followings">
                                <p className="font-bold">
                                    {user.followings.length}
                                </p>
                                <p className="text-neutral-500">followings</p>
                            </Link>
                        </Button>
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link className="flex gap-1" href="/followers">
                                <p className="font-bold">
                                    {user.followers.length}
                                </p>
                                <p className="text-neutral-500">followers</p>
                            </Link>
                        </Button>
                        <Button variant="link" className="px-0 py-0" asChild>
                            <Link className="flex gap-1" href="/wishes">
                                <p className="font-bold">
                                    {user.wishes.length}
                                </p>
                                <p className="text-neutral-500">wishes</p>
                            </Link>
                        </Button>
                    </div>
                }
                follow={<FriendButton friendId={user.id} />}
            />
            <Wishes wishes={user.wishes} />
        </div>
    );
}
