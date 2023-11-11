import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET) {
    throw new Error('There is no credentials for google provider!');
}

type Credentials = Record<'email' | 'password', string> | undefined;
type User = Credentials & { id: number };

const fetchUsers = async (url: string) => {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
        throw new Error('Error during getting users');
    }

    const result = await response.json();

    return result;
};

const getUser = async (credentials: Credentials) => {
    if (!credentials) {
        return;
    }

    const url = `http://localhost:5000/users`;
    const users = await fetchUsers(url);

    return users.find((item: User) => item.email === credentials.email);
};

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
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
            async authorize(credentials, req) {
                const user = await getUser(credentials);

                if (!user || !credentials) {
                    return null;
                }

                if (user.password === credentials.password) {
                    return user;
                }

                return null;
            },
        }),
    ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
