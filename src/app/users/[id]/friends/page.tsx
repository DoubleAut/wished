'use client';

import { setInitialUser, userStore } from '@/entities/user/model/user';
import { handleFriendsStore } from '@/entities/viewer/model/viewerFriendsStore';
import {
    FriendsList,
    FriendsNavigation,
    FriendsSearch,
    FriendsWidget,
} from '@/widgets/user/ui/Friends';
import { useLayoutEffect } from 'react';
import { useStore } from 'zustand';

interface Props {
    params: {
        id: number;
    };
}

const Home = ({ params: { id } }: Props) => {
    const store = useStore(userStore);

    useLayoutEffect(() => {
        setInitialUser(id);

        if (store.user) {
            handleFriendsStore(store.user);
        }
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
