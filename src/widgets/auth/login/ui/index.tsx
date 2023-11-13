'use client';

import { AuthCard } from '@/features/auth';
import {
    LoginForm,
    LoginHeader,
    LoginProviders,
    LoginQuestion,
} from '@/features/auth/login';

export const Login = () => {
    return (
        <AuthCard
            header={<LoginHeader />}
            form={<LoginForm />}
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
