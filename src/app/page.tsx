'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { WishDialog } from '@/features/wish/ui/WishDialog';

const Home = () => {
    const { user } = useViewerStore(state => state);

    return (
        <div className="container flex flex-col space-y-10">
            <div className="flex items-center space-x-4 uppercase">
                <p>My wishes</p>
                <WishDialog />
            </div>
            <Wishes wishes={user?.wishes} />
        </div>
    );
};

export default Home;
