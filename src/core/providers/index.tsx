import { ReactNode } from 'react';
import SessionProvider from './Auth';
import { getServerSession } from 'next-auth';

interface Props {
    children: ReactNode;
}

export const Providers = async ({ children }: Props) => {
    const session = await getServerSession();
    return (
        <>
            <SessionProvider session={session}>{children}</SessionProvider>
        </>
    );
};
