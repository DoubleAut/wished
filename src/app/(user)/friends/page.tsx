'use client';

import { getUsers } from '@/entities/user/lib/user';
import {
    setFollowers,
    setFollowings,
    updateCurrentList,
} from '@/entities/viewer/model/viewerFriendsStore';
import {
    FriendsList,
    FriendsNavigation,
    FriendsSearch,
    FriendsWidget,
} from '@/widgets/user/ui/Friends';
import { useLayoutEffect } from 'react';

const Home = () => {
    useLayoutEffect(() => {
        const init = async () => {
            const users = await getUsers();

            setFollowers(users);
            setFollowings(users.reverse());
            updateCurrentList('followers');
        };

        init();
    }, []);

    return (
        <div className="container flex flex-col items-center">
            <FriendsWidget
                navigation={<FriendsNavigation />}
                search={<FriendsSearch />}
                users={<FriendsList />}
            />
        </div>
    );
};

export default Home;
