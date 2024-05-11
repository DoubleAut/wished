import { z } from 'zod';

export interface RegisterSchema {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
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
        name: z.string().min(1, {
            message: 'Name cannot be empty',
        }),
        surname: z.string().min(1, {
            message: 'Surname cannot be empty',
        }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: 'Password must match',
        path: ['confirmPassword'],
    });
