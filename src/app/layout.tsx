import '@/core/styles/globals.css';
import '@uploadthing/react/styles.css';

import { Providers } from '@/core/providers';
import { Toaster } from '@/shared/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wished',
    description: 'Add and reserve wishes!',
};

async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="relative flex w-full flex-col items-center justify-center">
                    <Providers>{children}</Providers>
                </main>
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;
