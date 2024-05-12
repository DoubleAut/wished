'use client';

import { ReactNode } from 'react';
import { UserStoreProvider } from './UserProvider';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Props) => {
    return <UserStoreProvider>{children}</UserStoreProvider>;
};
