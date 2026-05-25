import { queryClient } from '@/shared/lib/constants/Query/QueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
