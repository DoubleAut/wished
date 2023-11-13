import { Errors, Inputs } from '@/shared/types/Auth';
import { signIn } from 'next-auth/react';

const errors: Errors = {
    email: {
        isError: false,
        messages: [],
    },
    password: {
        isError: false,
        messages: [],
    },
};

const returnObject = {
    isError: true,
    errors: null,
};

export const login = async (credentials: Inputs & { callbackUrl?: string }) => {
    const { email, password, callbackUrl } = credentials;

    const loginResult = await signIn('credentials', {
        email,
        password,
        callbackUrl,
    });

    if (!loginResult) {
        const result = {
            ...returnObject,
            errors: {
                ...errors,
                email: {
                    isError: true,
                    messages: [
                        'Error occured while signing in. Error is unknown...',
                    ],
                },
            },
        };

        return result;
    }

    if (!loginResult.ok) {
        const errs = loginResult.error;

        if (!errs) {
            const result = {
                ...returnObject,
                errors: {
                    ...errors,
                    email: {
                        isError: true,
                        messages: [
                            'Error occured while signing in. Error array is empty, so problem is unknown!',
                        ],
                    },
                },
            };

            return result;
        }

        const result = {
            ...returnObject,
            errors: {
                ...errors,
                email: {
                    isError: true,
                    messages: [errs],
                },
            },
        };

        return result;
    }

    const result = {
        ...returnObject,
    };

    return result;
};
