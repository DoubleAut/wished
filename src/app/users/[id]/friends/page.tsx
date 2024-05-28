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
        <div className="container flex flex-col items-center">
            <FriendsWidget user={user} />
        </div>
    );
};

export default Home;
