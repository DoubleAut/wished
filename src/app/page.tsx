'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import { Wishes } from '@/entities/wish/ui/Wishes';
import { Button } from '@/shared/ui/button';
import { useMemo } from 'react';

const Home = () => {
    const { user } = useViewerStore(state => state);

    const allWishes = useMemo(() => {
        const wishes = user?.wishes ?? [];
        const reservations = user?.reservations ?? [];

        return [...wishes, ...reservations];
    }, [user?.wishes, user?.reservations]);

    return (
        <div className="container flex flex-col space-y-10">
            <div className="flex items-center space-x-4 uppercase">
                <p>My wishes</p>
                <WishDialog
                    trigger={<Button variant="outline">Make a wish</Button>}
                    content={<WishForm onCancel={() => {}} />}
                />
            </div>
            <Wishes wishes={allWishes} />
        </div>
    );
};

export default Home;
