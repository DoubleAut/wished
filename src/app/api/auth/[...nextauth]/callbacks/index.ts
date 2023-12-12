import { AuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { refreshAccessToken } from '../services/tokens';

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
    session: async ({ session, token }) => {
        if (token) {
            const { id, email, name } = token;

            return {
                ...session,
                user: {
                    id: Number(id),
                    email,
                    name,
                },
                error: token.error,
            };
        }

        return {
            ...session,
            error: session.error,
        };
    },
};
