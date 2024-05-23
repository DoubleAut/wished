'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { UserProvider } from './UserProvider';
import { ViewerStoreProvider } from './ViewerProvider';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Props) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ViewerStoreProvider>
                <UserProvider>{children}</UserProvider>
            </ViewerStoreProvider>
        </ThemeProvider>
    );
};
