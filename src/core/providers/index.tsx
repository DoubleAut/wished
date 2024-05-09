'use client';

import { Session } from 'next-auth';
import { ReactNode } from 'react';
import SessionProvider from './Auth';

interface Props {
    children: ReactNode;
    session: Session | null;
}

export const Providers = ({ children, session }: Props) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
};
