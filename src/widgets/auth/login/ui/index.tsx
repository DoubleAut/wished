import { AuthCard } from '@/features/auth';
import {
    LoginForm,
    LoginHeader,
    LoginProviders,
    LoginQuestion,
} from '@/features/auth/login';
import { getProviders } from 'next-auth/react';

export const Login = async () => {
    const providers = await getProviders();

    return (
        <AuthCard
            header={<LoginHeader />}
            form={<LoginForm />}
            providers={<LoginProviders providers={providers} />}
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
