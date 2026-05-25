'use client';

import { getUser as getCurrentUser } from '@/features/auth/login/lib/getUser';
import { rotateTokens } from '@/shared/api/Fetch';
import { getAccessToken } from '@/shared/api/Fetch/accessToken';
import { ReactNode, useLayoutEffect } from 'react';
import { toast } from 'sonner';
import { useViewerStore } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

const refreshSessionAndGetUser = async () => {
    // Refresh the access token using the refresh token cookie.
    // `rotateTokens()` also updates localStorage via `setAccessToken`.
    await rotateTokens();

    const accessToken = getAccessToken();
    if (!accessToken) return null;

    // Fetch the currently authenticated user with the refreshed bearer token.
    return getCurrentUser(accessToken);
};

export function UserProvider({ children }: Props) {
    const setUser = useViewerStore(state => state.setUser);

    useLayoutEffect(() => {
        refreshSessionAndGetUser()
            .then(user => {
                setUser(user);
            })
            .catch(err => {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : 'Session refresh failed',
                );
                setUser(null);
            });
    }, []);

    return children;
}
