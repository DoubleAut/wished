import { getUserWithFriends } from '@/entities/user/lib/friends';
import { FriendsWidget } from '@/widgets/user/ui/Friends';

interface Props {
    params: {
        id: number;
    };
}

const Home = async ({ params: { id } }: Props) => {
    const user = await getUserWithFriends(id);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6">
            <FriendsWidget user={user} />
        </div>
    );
};

export default Home;
