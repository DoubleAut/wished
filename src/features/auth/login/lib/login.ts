import { Inputs } from '@/shared/types/Auth';
import { signIn } from 'next-auth/react';

export const login = async (credentials: Inputs & { callbackUrl?: string }) => {
    const { email, password, callbackUrl } = credentials;

    await signIn('credentials', {
        email,
        password,
        callbackUrl,
    });

    return {
        isError: false,
        errors: null,
    };
};
