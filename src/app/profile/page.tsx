'use client';

import { RootState } from '@/core/store';
import { User } from '@/entities/user/ui/User';
import { MakeWish, Wishes } from '@/entities/user/ui/Wishes';
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Home() {
    const user = useSelector((state: RootState) => state.user);

    if (!user) {
        const callbackUrl = encodeURI('/profile');
        const error = encodeURI('You must login to enter that page');

        redirect(`/auth/error?error=${error}&callbackUrl=${callbackUrl}`);
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
        <div className="flex w-full flex-col items-center gap-3 p-3">
            <User
                header={`${user.name} ${user.surname}`}
                subheader={`${amounts.wishes} wishes | ${amounts.friends} friends | ${amounts.reserved} reserved`}
                picture={user.picture}
                action={<MakeWish href="/profile" />}
            />
            <Wishes subheader="Wishes" wishes={user.wishes} />
            <Wishes subheader="Wish ideas" wishes={user.wishes} />
        </div>
    );
}
