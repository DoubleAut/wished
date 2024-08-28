import { z } from 'zod';

export interface RegisterSchema {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
}

export const registerSchema = z
    .object({
        email: z.string().email('Email must be valid'),
        password: z.string().min(2, {
            message: 'Password must be atleast 8 characters long',
        }),
        confirmPassword: z.string().min(2, {
            message: 'Confirm password must be atleast 8 characters long',
        }),
        username: z.string().min(1, {
            message: 'Username cannot be empty',
        }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: 'Password must match',
        path: ['confirmPassword'],
    });
