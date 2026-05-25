import '@/app/styles/globals.css';
import { RiGiftLine, RiStarLine } from '@remixicon/react';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Confirm | Wished',
    description: 'Add and reserve wishes!',
};

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Brand side */}
            <div className="from-(--color-accent-subtle) to-accent/30 hidden flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-br p-12 lg:flex">
                <div className="relative">
                    <div className="bg-accent/10 flex h-24 w-24 items-center justify-center rounded-full">
                        <RiGiftLine className="text-accent h-12 w-12" />
                    </div>
                    <div className="bg-accent/20 absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full">
                        <RiStarLine className="text-accent h-5 w-5" />
                    </div>
                </div>
                <div className="max-w-md text-center">
                    <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight">
                        Almost there!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Check your email for the confirmation code. One last
                        step and you're in!
                    </p>
                </div>
                <div className="flex gap-3">
                    {['📧', '🔐', '✨', '🎉'].map((emoji, i) => (
                        <div
                            key={i}
                            className="bg-background/60 flex h-12 w-12 items-center justify-center rounded-xl text-lg backdrop-blur-sm"
                        >
                            {emoji}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form side */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                {children}
            </div>
        </div>
    );
}

export default Layout;
