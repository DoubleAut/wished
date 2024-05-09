'use client';

import { userStore } from '@/entities/user/model/userStore';
import { User } from '@/entities/user/ui/User';
import { MakeWish, Wishes } from '@/entities/user/ui/Wishes';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useStore } from 'zustand';

export default function Home() {
    const user = useStore(userStore, state => state.user);
    const isLoading = useStore(userStore, state => state.isLoading);
    const status = useStore(userStore, state => state.status);
    const router = useRouter();

    useLayoutEffect(() => {
        if (!user && status === 'INITIALIZED') {
            const callbackUrl = encodeURI('/profile');
            const error = encodeURI('You must login to enter that page');

            router.push(
                `/auth/error?error=${error}&callbackUrl=${callbackUrl}`,
            );
        }
    }, [user, isLoading, router]);

    if (!user || isLoading) {
        return <div>Loading...</div>;
    }

    const amounts = {
        wishes: user.wishes.length,
        friends: user.friends.length,
        reserved: user.wishes.reduce(
            (acc, item) => (item.isReserved ? acc + 1 : acc),
            0,
        ),
    };

    return (
        <div className="flex w-full flex-col items-center gap-3 bg-slate-300 p-3">
            <button onClick={() => router.push('/')}>Go home</button>
            <User
                header={`${user.name} ${user.surname}`}
                subheader={amounts}
                picture={user.picture}
                action={<MakeWish href="/profile" />}
            />
            <Wishes subheader="Wishes" wishes={user.wishes} />
            <Wishes subheader="Wish ideas" wishes={user.wishes} />
        </div>
    );
}
