'use client';

import { AuthCard } from '@/entities/auth';
import {
    RegisterForm,
    RegisterHeader,
    RegisterProviders,
    RegisterQuestion,
} from '@/features/auth/register';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleRegister } from '../lib';
import { Inputs } from '@/shared/types/Auth';
import { signIn } from 'next-auth/react';

export const Register = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const onSubmit = async (creds: Inputs) => {
        const response = await handleRegister(creds);

        if (response.isError) {
            return response.errors;
        }

        signIn('credentials', { ...response.body, callbackUrl });
    };

    return (
        <AuthCard
            header={<RegisterHeader />}
            form={<RegisterForm onSubmit={onSubmit} />}
            providers={<RegisterProviders />}
            question={
                <RegisterQuestion
                    text="Already have an account?"
                    type="Sign in"
                    url="/auth/login"
                />
            }
        />
    );
};
