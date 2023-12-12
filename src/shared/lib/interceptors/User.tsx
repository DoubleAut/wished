'use client';

import { RootState } from '@/core/store';
import { getUserByEmail } from '@/entities/user/lib';
import { setUser } from '@/entities/user/model';
import { useSession } from 'next-auth/react';
import { ReactNode, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const UserInterceptor = ({ children }: { children: ReactNode }) => {
    const user = useSelector((state: RootState) => state.user);
    const { data: session } = useSession();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (session?.user && !user) {
            const handleUser = async () => {
                const response = await getUserByEmail(session.user.email);

                dispatch(setUser(response));
            };

            handleUser();
        }
    }, [session, user]);

    return children;
};
