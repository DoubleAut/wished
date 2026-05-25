import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Profile | Wished',
    description:
        'Your personal profile — manage your wishlist, see your stats, and keep track of gifts.',
};

export const ProfileLayout = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);

export default ProfileLayout;
