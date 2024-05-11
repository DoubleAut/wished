import { User } from '@/shared/types/User';
import { compare, hash } from 'bcrypt';
import { fetcher } from './fetcher';
import { generateTokens, saveTokens } from './tokens';

type Credentials = Record<'email' | 'password', string> | undefined;

export const getUser = async (credentials: Credentials) => {
    if (!credentials) {
        return null;
    }

    try {
        const user = await fetcher.get(`/users?email=${credentials.email}`);

        if (!user) {
            return null;
        }

        return user.data[0] as User;
    } catch (e) {
        throw new Error('Error during calling a backend part');
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const user = await fetcher.get(`/users?email=${email}`);

        return user.data[0];
    } catch (err) {
        throw new Error('Unknown user.');
    }
};

export const isPasswordsEqual = async (password: string, hash: string) =>
    await compare(password, hash);

export const hashPassword = (password: string) => hash(password, 10);
export const hashSecret = (data: string) => hash(data, 15);

export const createUser = async (credentials: {
    email: string;
    password: string;
}) => {
    const { email, password } = credentials;
    const hashedPassword = await hashPassword(password);
    const response = await fetcher.post('/users', {
        email,
        password: hashedPassword,
        name: '',
        surname: '',
        friends: [],
        wishes: [],
    });

    if (response.status !== 201) {
        throw new Error('Error occured while creating the user!');
    }

    const { password: _, ...user } = response.data;
    const tokens = generateTokens(user);

    await saveTokens(user, tokens);

    return {
        ...user,
        accessToken: tokens.accessToken,
    };
};
