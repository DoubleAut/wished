import '@/app/styles/globals.css';

import { Providers } from '@/app/providers';
import { cn } from '@/shared/lib/classNames/cn';
import { NAVIGATION_LINKS } from '@/shared/lib/constants/Links';
import { UserHeaderAvatar } from '@/shared/ui/AuthHeader';
import { Navigation } from '@/shared/ui/Navigation';
import { ModeToggle } from '@/shared/ui/Theme';
import { Toaster } from '@/shared/ui/sonner';
import { HeaderWidget } from '@/widgets/header';
import { RiGiftLine } from '@remixicon/react';
import type { Metadata } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import { ReactNode } from 'react';

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'WISHED',
    description: 'Add and reserve wishes!',
};

async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn('font-sans', geist.variable, playfair.variable)}
        >
            <body className={geist.className}>
                <Providers>
                    <main className="relative flex w-full flex-col items-center">
                        <HeaderWidget
                            logo={
                                <a
                                    href="/"
                                    className="text-foreground flex items-center gap-2 no-underline"
                                >
                                    <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-lg">
                                        <RiGiftLine className="text-accent-foreground h-4 w-4" />
                                    </div>
                                    <span className="font-heading text-lg font-bold tracking-tight">
                                        wished
                                    </span>
                                </a>
                            }
                            links={<Navigation links={NAVIGATION_LINKS} />}
                            profile={
                                <div className="flex items-center gap-1.5">
                                    <ModeToggle />
                                    <UserHeaderAvatar />
                                </div>
                            }
                        />
                        <div className="w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
