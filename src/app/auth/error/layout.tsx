import '@/core/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Login | Wished',
    description: 'Add and reserve wishes!',
};

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center">
            {children}
        </div>
    );
}

export default Layout;
