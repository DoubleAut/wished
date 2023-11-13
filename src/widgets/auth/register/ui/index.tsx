'use client';

import { AuthCard } from '@/features/auth';
import {
    RegisterForm,
    RegisterHeader,
    RegisterProviders,
    RegisterQuestion,
} from '@/features/auth/register';

export const Register = () => {
    return (
        <AuthCard
            header={<RegisterHeader />}
            form={<RegisterForm />}
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
