import '@/core/styles/globals.css';
import { getUsers } from '@/entities/user/lib/user';
import {
    setFollowers,
    setFollowings,
    updateCurrentList,
} from '@/entities/viewer/model/viewerFriendsStore';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Friends | Wished',
    description: 'Your friends',
};

async function RootLayout({ children }: { children: ReactNode }) {
    setFollowers(await getUsers());
    setFollowings((await getUsers()).reverse());
    updateCurrentList('followers');

    console.log('HELLO!');

    return <>{children}</>;
}

export default RootLayout;
