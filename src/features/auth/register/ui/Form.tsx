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
import { toast } from 'sonner';
import { z } from 'zod';
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
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
        },
    });

    const onSubmit = (result: RegisterSchema) => {
        setLoading(true);

        signUp(result)
            .then(() => {
                router.push(`/auth/confirm?username=${result.username}`);
            })
            .catch((err: any) => {
                toast.error(err);
            })
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading text-xl">
                        Register
                    </CardTitle>
                    <CardDescription>
                        Create your account and start wishing!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="JohnDoe"
                            {...register('username')}
                        />
                        {errors.username && (
                            <Label className="text-destructive">
                                {errors.username?.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                        />
                        {errors.password && (
                            <Label className="text-destructive">
                                {errors.password?.message}
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
