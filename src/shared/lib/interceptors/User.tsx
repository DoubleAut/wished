'use client';

import { setUser, userStore } from '@/entities/user/model/userStore';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { useStore } from 'zustand';

export const UserInterceptor = ({ children }: { children: ReactNode }) => {
    const user = useStore(userStore, state => state.user);
    const { data: session } = useSession();

    const handleUser = async () => {
        await setUser(session!.user.email);
    };

    if (session?.user && !user) {
        handleUser();
    }

    return children;
};
