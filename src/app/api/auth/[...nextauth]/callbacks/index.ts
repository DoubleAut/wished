import { refreshAccessToken } from '../services/tokens';

export const callbacks = {
    jwt: async ({ token, user }: { token: any; user: any }) => {
        if (user) {
            return {
                tokens: {
                    ...token.tokens,
                },
                ...user,
            };
        }

        if (Date.now() < token.exp) {
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
};
