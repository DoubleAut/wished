'use client';

import { getUser } from '@/entities/user/lib/user';
import { rotateTokens } from '@/shared/lib/axios/axiosRequest';
import { ACCESS_TOKEN_KEY } from '@/shared/lib/constants/localStorage';
import { useRouter } from 'next/navigation';
import { ReactNode, useLayoutEffect } from 'react';
import { useViewerStore } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

const revokeSession = async () => {
    const response = await rotateTokens();

    const user = await getUser(response.id);

    return user;
};

export function UserProvider({ children }: Props) {
    const store = useViewerStore(state => state);
    const router = useRouter();

    useLayoutEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken) {
            revokeSession()
                .then(user => {
                    store.setViewer(user);
                })
                .catch(() => router.push(`/auth/login?callbackUrl=/`));
        }
    }, []);

    return children;
}
