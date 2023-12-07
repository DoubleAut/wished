import NextAuth, { AuthOptions } from 'next-auth';
import { callbacks } from './callbacks';
import { providers } from './providers';

const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    providers: providers,
    callbacks: callbacks,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
