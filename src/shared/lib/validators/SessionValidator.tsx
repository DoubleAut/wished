'use client';

import { useSession } from 'next-auth/react';
import { usePathname, redirect } from 'next/navigation';
import { ReactNode, useLayoutEffect } from 'react';

export const SessionValidator = ({ children }: { children: ReactNode }) => {
    const { status } = useSession();
    const path = usePathname();

    useLayoutEffect(() => {
        if (status === 'unauthenticated') {
            const error = encodeURI('Session expired');
            const callbackUrl = encodeURI(path);

            redirect(`/auth/error?error=${error}&callbackUrl=${callbackUrl}`);
        }
    }, [status]);

    return children;
};
