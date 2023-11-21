import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getUserTokens, generateTokens, saveTokens } from '../services/tokens';
import { getUser, isPasswordsEqual } from '../services/user';

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET) {
    throw new Error('There is no credentials for google provider!');
}

export const providers = [
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
                const { password, wishes, friends, ...rest } = user;
                const newTokens = await saveTokens(user, tokens);

                return {
                    ...rest,
                    tokens: {
                        ...tokens,
                        tokenId: newTokens.id,
                    },
                };
            }

            const { password, wishes, friends, ...rest } = user;

            return {
                ...rest,
                tokens: {
                    ...tokens,
                    tokenId: tokens.id,
                },
            };
        },
    }),
];
