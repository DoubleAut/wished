'use client';

import { getUser } from '@/entities/user/lib/user';
import { rotateTokens } from '@/shared/api/Fetch';
import { getAccessToken } from '@/shared/api/Fetch/accessToken';
import { PlainUser } from '@/shared/types/User';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { useViewerStore } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

const revokeSession = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        console.log('No access token found. Redirecting to login page!!!');
        throw new Error('No access token');
    }

    const response = await rotateTokens();

    return await getUser(String(response.id));
};

export function UserProvider({ children }: Props) {
    const [isLoading, setLoading] = useState(true);
    const setUser = useViewerStore(state => state.setUser);
    const router = useRouter();

    const setInitialUser = useCallback(
        (user: PlainUser) => {
            setUser(user);
        },
        [setUser],
    );

    useLayoutEffect(() => {
        revokeSession()
            .then(user => {
                if (user) {
                    setUser(user);

                    toast.success('Session revocation successful');
                }
            })
            .catch(err => {
                console.log('Session revocation error: ', err);

                toast.error(err.message);
            });
    }, []);

    return children;
}
