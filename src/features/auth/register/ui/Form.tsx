'use client';

import { Errors, Inputs } from '@/shared/types/Auth';
import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { validate } from '../lib/validate';

type LocalErrors = Required<Errors>;

interface Props {
    onSubmit: (data: Inputs) => Promise<LocalErrors | undefined>;
}

export const Form = ({ onSubmit }: Props) => {
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

    const _onSubmit = async () => {
        const validation = validate({ email, password, passwordRepeat });
        const isEmailError = validation.email.isError;
        const isPassError = validation.password.isError;
        const isPassRepeatError = validation.passwordRepeat.isError;

        if (isEmailError || isPassError || isPassRepeatError) {
            setErrors(validation);

            return;
        }

        const registerErrors = await onSubmit({ email, password });

        if (registerErrors) {
            setErrors(registerErrors);

            return;
        }
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
            <Button className="w-full" onClick={_onSubmit}>
                Register
            </Button>
        </Wrapper>
    );
};
