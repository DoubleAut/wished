import '@/core/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Friends | Wished',
    description: 'Your friends',
};

async function RootLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export default RootLayout;
