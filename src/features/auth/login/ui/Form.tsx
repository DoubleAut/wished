'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
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
import { loginSchema } from '@/widgets/auth/login/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getError } from '../../lib';
import { getUser } from '../lib/getUser';
import { login } from '../lib/login';

export const LoginForm = () => {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useViewerStore(state => state.setUser);

    const {
        register,
        formState: { errors },
        ...form
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: 'richardpickman32',
            email: 'drezzerock+32@gmail.com',
            password: '123,.Qweasd',
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

        console.log('this is handle message error', err, error);

        if (error) {
            form.setError(error, { message });
        }
    };

    const onSuccessfulLogin = async (accessToken: string) => {
        const user = await getUser(accessToken);

        localStorage.setItem('accessToken', accessToken);

        setUser(user);

        router.push('/');
    };

    const onSubmit = (result: z.infer<typeof loginSchema>) => {
        setLoading(true);

        login(result)
            .then(data => onSuccessfulLogin(data.accessToken))
            .catch(handleMessageError)
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Please enter your details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            placeholder="johndoe"
                            id="username"
                            {...register('username')}
                        />
                        {errors.username && (
                            <Label className="text-destructive">
                                {errors.username?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="mail@mail.com"
                            id="email"
                            {...register('email')}
                        />
                        {errors.email && (
                            <Label className="text-destructive">
                                {errors.email?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                        />
                        {errors.email && (
                            <Label className="text-destructive">
                                {errors.password?.message}
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
                            'Sign in'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};
