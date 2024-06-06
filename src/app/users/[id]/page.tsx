import { getUser } from '@/entities/user/lib/user';
import { UserAvatar, UserInitials } from '@/entities/user/ui/User';
import { getUserWishes } from '@/entities/wish/lib';
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

const Home = async ({ params: { id } }: Props) => {
    const user = await getUser(id);
    const wishes = await getUserWishes(id);

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
                    </div>
                }
                follow={<FriendButton friendId={user.id} />}
            />
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Wishes wishes={wishes} />
            </div>
        </div>
    );
};

export default Home;
