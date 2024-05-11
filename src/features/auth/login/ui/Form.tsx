'use client';

import { login } from '@/entities/user/model/userStore';
import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { LoginSchema, loginSchema } from '@/widgets/auth/login/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getError } from '../../lib';

export const LoginForm = () => {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'mail@mail.com',
            password: '123Qweasd',
        },
    });

    const onSubmit = (result: LoginSchema) => {
        setLoading(true);

        login(result)
            .then(() => {
                router.push('/profile');
            })
            .catch(err => {
                const { response } = err;

                if (Array.isArray(response.data.message)) {
                    for (let message of response.data.message) {
                        const err = getError(message) as
                            | 'email'
                            | 'password'
                            | null;

                        if (err) {
                            form.setError(err, { message });
                        }
                    }
                } else {
                    const message = response.data.message;
                    const err = getError(message) as
                        | 'email'
                        | 'password'
                        | null;

                    if (err) {
                        form.setError(err, { message });
                    }
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                            Please enter your details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="mail@mail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="capitalize" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage className="capitalize" />
                                </FormItem>
                            )}
                        />
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
                                'Login'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};
