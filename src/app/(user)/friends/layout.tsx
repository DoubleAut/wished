import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Friends | Wished',
    description: 'Your friends',
};

export const FriendsLayout = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);

export default FriendsLayout;
