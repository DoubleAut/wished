'use client';

import { Errors, Inputs } from '@/shared/types/Auth';
import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { validate } from '../lib/validate';
import { createUser } from '../lib/register';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useSubmitListener } from '@/shared/lib/hooks/useSubmitListener';

type LocalErrors = Required<Errors>;

export const Form = () => {
    const params = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [errors, setErrors] = useState<LocalErrors>({
        email: {
            isError: false,
            messages: [],
        },
        password: {
            isError: false,
            messages: [],
        },
        passwordRepeat: {
            isError: false,
            messages: [],
        },
    });

    const onSubmit = async () => {
        const validation = validate({ email, password, passwordRepeat });
        const isEmailError = validation.email.isError;
        const isPassError = validation.password.isError;
        const isPassRepeatError = validation.passwordRepeat.isError;

        if (isEmailError || isPassError || isPassRepeatError) {
            setErrors(validation);

            return;
        }

        const { isError, errors } = await createUser({ email, password });
        const callbackUrl = params.get('callbackUrl') ?? '/';

        if (isError && errors) {
            setErrors(errors);

            return;
        }

        signIn('credentials', { email, password, callbackUrl });
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
                <Label htmlFor="password">Repeat password</Label>
                <Input
                    id="password"
                    type="password"
                    value={passwordRepeat}
                    onChange={event => setPasswordRepeat(event.target.value)}
                />
                {errors.passwordRepeat.isError &&
                    errors.passwordRepeat.messages.map(item => (
                        <Label key={item} className="text-red-500">
                            {item}
                        </Label>
                    ))}
            </Wrapper>
            <Button className="w-full" onClick={onSubmit}>
                Register
            </Button>
        </Wrapper>
    );
};
