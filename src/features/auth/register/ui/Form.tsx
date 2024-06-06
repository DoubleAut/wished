'use client';

import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RegisterSchema, registerSchema } from '@/widgets/auth/register/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getError } from '../../lib';
import { register as signUp } from '../lib/register';

export const RegistrationForm = () => {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        formState: { errors },
        ...form
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: 'mail@mail.com',
            password: '123Qweasd',
            confirmPassword: '123Qweasd',
            name: 'John',
            surname: 'Doe',
        },
    });

    const handleArrayError = (err: any) => {
        for (let message of err.message) {
            const error = getError(message) as 'email' | 'password' | null;

            if (error) {
                form.setError(error, { message });
            }
        }
    };

    const handleMessageError = (err: any) => {
        const message = err.message;
        const error = getError(message) as 'email' | 'password' | null;

        if (error) {
            form.setError(error, { message });
        }
    };

    const onSubmit = (result: RegisterSchema) => {
        setLoading(true);

        signUp(result)
            .then(() => {
                router.push('/auth/login');
            })
            .catch((err: any) => {
                Array.isArray(err.message)
                    ? handleArrayError(err)
                    : handleMessageError(err);
            })
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Please enter your details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="mail@mail.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <Label className="text-destructive">
                                {errors.email?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="email">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                        />
                        {errors.password && (
                            <Label className="text-destructive">
                                {errors.email?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <Label className="text-destructive">
                                {errors.confirmPassword?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="John"
                            {...register('name')}
                        />
                        {errors.name && (
                            <Label className="text-destructive">
                                {errors.name?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="consurname">Surname</Label>
                        <Input
                            id="surname"
                            placeholder="John"
                            {...register('surname')}
                        />
                        {errors.surname && (
                            <Label className="text-destructive">
                                {errors.surname?.message}
                            </Label>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};
