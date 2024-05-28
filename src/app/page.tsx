'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { useMemo } from 'react';

const Home = () => {
    const user = useViewerStore(state => state.user);
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);

    const allWishes = useMemo(() => {
        return [...wishes, ...reservations];
    }, [wishes, reservations]);

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <div className="container flex flex-col">
            <div className="flex items-center space-x-4 uppercase">
                <p>My wishes</p>
                <WishDialog
                    trigger={'Make a wish'}
                    content={<WishForm onCancel={() => {}} />}
                    wish={null}
                />
            </div>
            <Wishes wishes={allWishes} />
        </div>
    );
};

export default Home;
