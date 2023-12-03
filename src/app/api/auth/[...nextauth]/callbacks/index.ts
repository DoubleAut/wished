import { JWT } from 'next-auth/jwt';
import { refreshAccessToken } from '../services/tokens';
import { AuthOptions, Session, User } from 'next-auth';

export const callbacks: AuthOptions['callbacks'] = {
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
        if (user) {
            const result = {
                ...user,
                ...token,
            };

            return result;
        }

        if (!token.id || !token.surname || !token.exp) {
            return token;
        }

        if (Date.now() < token.exp) {
            return token;
        }

        const credentials = {
            email: token.email,
            id: token.id,
            name: token.name,
            surname: token.surname,
            picture: token.picture,
        };

        return await refreshAccessToken(credentials, token as Required<JWT>);
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
                error: '',
            };
        } catch (error) {
            console.log('session error =', error);
            return null;
        }
    },
};
