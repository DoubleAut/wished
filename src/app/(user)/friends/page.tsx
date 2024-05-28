'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { FriendsWidget } from '@/widgets/user/ui/Friends';

const Home = () => {
    const user = useViewerStore(state => state.user);
    const followers = useViewerStore(state => state.followers);
    const followings = useViewerStore(state => state.followings);

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <div className="container flex flex-col items-center">
            <FriendsWidget user={{ ...user, followers, followings }} />
        </div>
    );
};

export default Home;
