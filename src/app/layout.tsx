import '@/core/styles/globals.css';
import '@uploadthing/react/styles.css';

import { Providers } from '@/core/providers';
import { NAVIGATION_LINKS } from '@/shared/lib/constants/Links';
import { AuthHeader } from '@/shared/ui/AuthHeader';
import { Navigation } from '@/shared/ui/Navigation';
import { ModeToggle } from '@/shared/ui/Theme';
import { Toaster } from '@/shared/ui/sonner';
import { HeaderWidget } from '@/widgets/header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'WISHED',
    description: 'Add and reserve wishes!',
};

async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <main className="relative flex w-full flex-col items-center justify-center space-y-2">
                        <HeaderWidget
                            logo={<p>WISHED</p>}
                            links={<Navigation links={NAVIGATION_LINKS} />}
                            profile={
                                <div className="flex space-x-1">
                                    <ModeToggle />
                                    <AuthHeader />
                                </div>
                            }
                        />
                        {children}
                    </main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
