import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: QueryProviderProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
