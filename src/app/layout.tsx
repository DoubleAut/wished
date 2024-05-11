import { Providers } from '@/core/providers';
import '@/core/styles/globals.css';
import { UserInterceptor } from '@/shared/lib/interceptors/User';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wished',
    description: 'Add and reserve wishes!',
};

async function RootLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="mx-auto flex max-w-7xl flex-col items-center justify-center">
                    <Providers session={session}>
                        <UserInterceptor>{children}</UserInterceptor>
                    </Providers>
                </main>
            </body>
        </html>
    );
}

export default RootLayout;
