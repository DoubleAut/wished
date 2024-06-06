'use client';

import { getOwnFullUser } from '@/entities/user/lib/user';
import { rotateTokens } from '@/shared/api/Fetch';
import { isSessionExist } from '@/shared/api/Fetch/tokens';
import { FullUser } from '@/shared/types/User';
import { Skeleton } from '@/shared/ui/skeleton';
import { HeaderWidget } from '@/widgets/header';
import { redirect, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useLayoutEffect, useState } from 'react';
import { useViewerStore } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

const revokeSession = async () => {
    const isSession = isSessionExist();

    if (!isSession) {
        console.log('Saves session is not found. Redirecting to login page!!!');

        redirect('/auth/login');
    }

    const response = await rotateTokens();

    return await getOwnFullUser(response.id);
};

export function UserProvider({ children }: Props) {
    const [isLoading, setLoading] = useState(true);
    const setFullUser = useViewerStore(state => state.setFullUser);
    const router = useRouter();

    const setInitialUser = useCallback(
        (user: FullUser) => {
            setFullUser(user);
        },
        [setFullUser],
    );

    useLayoutEffect(() => {
        revokeSession()
            .then(user => setInitialUser(user))
            .catch(() => router.push(`/auth/login`))
            .finally(() => setLoading(false));
    }, [router, setInitialUser]);

    if (isLoading) {
        return (
            <div className="flex flex-col">
                <HeaderWidget
                    logo={<Skeleton className="h-6 w-20" />}
                    links={
                        <div className="flex gap-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    }
                    profile={<Skeleton className="h-10 w-10 rounded-full" />}
                />
                <div className="container flex flex-col gap-4">
                    <Skeleton className="h-full w-fit" />
                    <div className="grid grid-cols-3">
                        <Skeleton className="col-span-1 h-full w-full" />
                        <Skeleton className="col-span-1 h-full w-full" />
                        <Skeleton className="col-span-1 h-full w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
