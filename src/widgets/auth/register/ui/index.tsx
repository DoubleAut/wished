import { AuthCard } from '@/features/auth';
import {
    RegisterForm,
    RegisterHeader,
    RegisterProviders,
    RegisterQuestion,
} from '@/features/auth/register';
import { getProviders } from 'next-auth/react';

export const Register = async () => {
    const providers = await getProviders();
    return (
        <AuthCard
            header={<RegisterHeader />}
            form={<RegisterForm />}
            providers={<RegisterProviders providers={providers} />}
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
