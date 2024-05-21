import { z } from 'zod';

export interface LoginSchema {
    email: string;
    password: string;
}

export const loginSchema = z.object({
    email: z.string().email('Email must be valid'),
    password: z.string().min(2, {
        message: 'Password must be atleast 8 characters long',
    }),
});
