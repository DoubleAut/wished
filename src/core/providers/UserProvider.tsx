'use client';

import { getOwnFullUser } from '@/entities/user/lib/user';
import { rotateTokens } from '@/shared/api/Fetch';
import { isSessionExist } from '@/shared/api/Fetch/tokens';
import { Skeleton } from '@/shared/ui/skeleton';
import { HeaderWidget } from '@/widgets/header';
import { redirect, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
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
    const [isLoading, setLoading] = useState(false);
    const setFullUser = useViewerStore(state => state.setFollowings);
    const router = useRouter();

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
                    <Skeleton className="mt-4 h-8 w-24" />
                    <div className="grid h-full w-full grid-cols-3 gap-5">
                        <Skeleton className="col-span-1 h-40 w-full" />
                        <Skeleton className="col-span-1 h-40 w-full" />
                        <Skeleton className="col-span-1 h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
