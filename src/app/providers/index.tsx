'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
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
            <QueryProvider>
                <ViewerStoreProvider>
                    <UserProvider>{children}</UserProvider>
                </ViewerStoreProvider>
            </QueryProvider>
        </ThemeProvider>
    );
};
