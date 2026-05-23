import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            id: string;
            username: string;
            email?: string;
            name?: string;
            surname?: string;
            picture?: string;
            isActive?: boolean;
        } & DefaultSession['user'];
        accessToken: string;
    }
}
