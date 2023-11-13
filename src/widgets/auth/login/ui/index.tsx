'use client';

import { AuthCard } from '@/features/auth';
import {
    LoginForm,
    LoginHeader,
    LoginProviders,
    LoginQuestion,
} from '@/features/auth/login';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Login = () => {
    const [errors, setErrors] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorMessage = searchParams.get('error') ?? '/';

        if (errorMessage) {
            setErrors(errorMessage);
        }
    }, []);

    return (
        <AuthCard
            header={<LoginHeader />}
            form={
                <LoginForm
                    err={{
                        email: {
                            isError: true,
                            messages: [errors],
                        },
                        password: {
                            isError: false,
                            messages: [],
                        },
                    }}
                />
            }
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
