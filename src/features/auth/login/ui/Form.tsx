'use client';

import { Errors, Inputs } from '@/shared/types/Auth';
import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { validate } from '../lib/validate';

interface Props {
    onSubmit: (data: Inputs) => void;
    err?: Errors | null;
}

export const Form = ({ onSubmit, err }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<Errors>(
        err || {
            email: {
                isError: false,
                messages: [],
            },
            password: {
                isError: false,
                messages: [],
            },
        },
    );

    const _onSubmit = async () => {
        const validation = validate({ email, password });
        const isEmailError = validation.email.isError;
        const isPassError = validation.password.isError;

        if (isEmailError || isPassError) {
            setErrors(validation);

            return;
        }

        // const registerErrors = await onRegister({
        //     email,
        //     password,
        // });

        onSubmit({ email, password });

        // registerErrors ? setErrors(registerErrors) : onSubmit();

        return;
    };

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
                        <Label className="text-red-500">{item}</Label>
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
                        <Label className="text-red-500">{item}</Label>
                    ))}
            </Wrapper>
            <Wrapper>
                <Button className="w-full" onClick={_onSubmit}>
                    Login
                </Button>
            </Wrapper>
        </Wrapper>
    );
};
