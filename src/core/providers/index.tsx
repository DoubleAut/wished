'use client';

import { Session } from 'next-auth';
import { ReactNode } from 'react';
import SessionProvider from './Auth';
import { StoreProvider } from './StoreProvider';

interface Props {
    children: ReactNode;
    session: Session | null;
}

export const Providers = ({ children, session }: Props) => {
    return (
        <>
            <SessionProvider session={session}>
                <StoreProvider>{children}</StoreProvider>
            </SessionProvider>
        </>
    );
};
