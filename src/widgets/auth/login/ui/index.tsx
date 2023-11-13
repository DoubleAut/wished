'use client';

import { AuthCard } from '@/features/auth';
import {
    LoginForm,
    LoginHeader,
    LoginProviders,
    LoginQuestion,
} from '@/features/auth/login';
import { Inputs } from '@/shared/types/Auth';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export const Login = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const onSubmit = async (data: Inputs) => {
        const result = await signIn('credentials', { ...data, callbackUrl });

        console.log(result);
    };

    return (
        <AuthCard
            header={<LoginHeader />}
            form={<LoginForm onSubmit={onSubmit} />}
            providers={<LoginProviders />}
            question={
                <LoginQuestion
                    text="Don’t have an account?"
                    type="Sign up"
                    url="/auth/register"
                />
            }
        />
    );
};
