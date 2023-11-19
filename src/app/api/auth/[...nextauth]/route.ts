import { StrippedUser, User } from '@/shared/types/User';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import {
    generateTokens,
    getUserTokens,
    refreshAccessToken,
    saveTokens,
} from './services/tokens';
import { getUser, isPasswordsEqual } from './services/user';

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET) {
    throw new Error('There is no credentials for google provider!');
}

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('There is no data provided');
                }

                const user = await getUser(credentials);

                if (!user) {
                    throw new Error('There is no user with provided email');
                }

                const isEqual = await isPasswordsEqual(
                    credentials.password,
                    user.password,
                );

                if (!isEqual) {
                    throw new Error('Credentials are wrong!');
                }

                const tokens = await getUserTokens(user.id);

                if (!tokens) {
                    const tokens = generateTokens(user);

                    const newTokens = await saveTokens(user, tokens);

                    return {
                        ...user,
                        ...tokens,
                        tokenId: newTokens.id,
                    };
                }

                return {
                    ...user,
                    ...tokens,
                    tokenId: tokens.id,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }: { token: any; user: any }) => {
            if (user) {
                return {
                    ...token,
                    ...user,
                };
            }

            if (Date.now() < token.accessTokenExpiresIn) {
                return token;
            }

            const credentials = {
                email: token.email,
                id: token.id,
                image: token.image,
                name: token.name,
                surname: token.surname,
            };

            return await refreshAccessToken(credentials, token);
        },
        session: async ({ session, token }: { session: any; token: any }) => {
            try {
                if (token) {
                    return {
                        ...session,
                        ...token,
                        error: token.error,
                    };
                }

                return {
                    ...session,
                    error: token.error,
                };
            } catch (error) {
                console.log('session error =', error);
                return null;
            }
        },
    },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
