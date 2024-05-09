'use client';

import { useSubmitListener } from '@/shared/lib/hooks/useSubmitListener';
import { Errors } from '@/shared/types/Auth';
import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { login } from '../lib/login';
import { validate } from '../lib/validate';

interface Props {
    err?: Errors | null;
}

export const Form = ({ err }: Props) => {
    const params = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<Errors>(
        err || {
            email: {
                isError: !!params.get('error'),
                messages: [params.get('error') || ''],
            },
            password: {
                isError: false,
                messages: [],
            },
        },
    );

    const onSubmit = async () => {
        const validation = validate({ email, password });
        const isEmailError = validation.email.isError;
        const isPassError = validation.password.isError;

        if (isEmailError || isPassError) {
            setErrors(validation);

            return;
        }

        const callbackUrl = params.get('callbackUrl') ?? '/';

        const { isError, errors } = await login({
            email,
            password,
            callbackUrl,
        });

        if (isError && errors) {
            setErrors(errors);

            return;
        }
    };

    useSubmitListener(onSubmit);

    return (
        <Wrapper className="gap-4">
            <Wrapper>
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    placeholder="johndoe@mail.com"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />
                {errors.email.isError &&
                    errors.email.messages.map(item => (
                        <Label key={item} className="text-red-500">
                            {item}
                        </Label>
                    ))}
            </Wrapper>
            <Wrapper>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
                {errors.password.isError &&
                    errors.password.messages.map(item => (
                        <Label key={item} className="text-red-500">
                            {item}
                        </Label>
                    ))}
            </Wrapper>
            <Wrapper>
                <Button className="w-full" onClick={onSubmit}>
                    Login
                </Button>
            </Wrapper>
        </Wrapper>
    );
};
