import { Providers } from '@/core/providers';
import '@/core/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wished',
    description: 'Add and reserve wishes!',
};

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="mx-auto flex max-w-7xl flex-col items-center justify-center">
                    <Providers>{children}</Providers>
                </main>
            </body>
        </html>
    );
}

export default RootLayout;
