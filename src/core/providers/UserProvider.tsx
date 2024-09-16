'use client';

import { getUser } from '@/features/auth/login/lib/getUser';
import { rotateTokens } from '@/shared/api/Fetch';
import { ACCESS_TOKEN_KEY } from '@/shared/lib/constants/localStorage';
import { ReactNode, useLayoutEffect } from 'react';
import { toast } from 'sonner';
import { useViewerStore } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

const revokeSession = async () => {
    const response = await rotateTokens();

    if (!response) {
        return null;
    }

    const user = await getUser(response.accessToken);

    return user;
};

const isAccessTokenExist = () =>
    Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));

export function UserProvider({ children }: Props) {
    const setFullUser = useViewerStore(state => state.setUser);

    useLayoutEffect(() => {
        const isExist = isAccessTokenExist();

        if (isExist) {
            revokeSession()
                .then(user => {
                    if (user) {
                        setFullUser(user);

                        toast.success('Session revocation successful');
                    }
                })
                .catch(err => {
                    console.log('Session revocation error: ', err);

                    toast.error(err.message);
                });
        }
    }, []);

    return children;
}
