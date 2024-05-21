import {
    FriendsList,
    FriendsNavigation,
    FriendsSearch,
    FriendsWidget,
} from '@/widgets/user/ui/Friends';

export default async function Home() {
    return (
        <div className="container flex flex-col items-center">
            <FriendsWidget
                navigation={<FriendsNavigation />}
                search={<FriendsSearch />}
                users={<FriendsList />}
            />
        </div>
    );
}
