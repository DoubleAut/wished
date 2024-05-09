import '@/core/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Profile | Wished',
    description: 'Your profile page',
};

async function Layout({ children }: { children: ReactNode }) {
    return children;
}

export default Layout;
