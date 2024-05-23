'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { handleFriendsStore } from '@/entities/viewer/model/viewerFriendsStore';
import {
    FriendsList,
    FriendsNavigation,
    FriendsSearch,
    FriendsWidget,
} from '@/widgets/user/ui/Friends';
import { useLayoutEffect } from 'react';

const Home = () => {
    const store = useViewerStore(state => state);

    useLayoutEffect(() => {
        if (store.user) {
            handleFriendsStore(store.user);
        }
    }, []);

    return (
        <div className="container flex flex-col items-center">
            <FriendsWidget
                navigation={<FriendsNavigation />}
                search={<FriendsSearch />}
                users={<FriendsList onFollowAction={() => {}} />}
            />
        </div>
    );
};

export default Home;
