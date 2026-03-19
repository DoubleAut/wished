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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { confirm } from '../lib/confirm';

const confirmationSchema = z.object({
    code: z.string().min(6).max(6),
});

export const ConfirmationForm = () => {
    const searchParams = useSearchParams();
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const username = searchParams.get('username');

    const {
        register,
        formState: { errors },
        ...form
    } = useForm<z.infer<typeof confirmationSchema>>({
        resolver: zodResolver(confirmationSchema),
    });

    const onSubmit = (result: z.infer<typeof confirmationSchema>) => {
        setLoading(true);

        if (!username) {
            return toast.error('Username is required to confirm');
        }

        confirm({ ...result, username })
            .then(() => {
                toast.success('Successfully confirmed');

                router.push('/auth/login');
            })
            .catch(err => toast.error(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
            <Card>
                <CardHeader>
                    <CardTitle>Confirmation</CardTitle>
                    <CardDescription>
                        Confirmation code sent to {username} email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="mx-auto space-y-2">
                    <Controller
                        name="code"
                        control={form.control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <InputOTP
                                maxLength={6}
                                value={value}
                                onChange={onChange}
                                name="code"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />
                    {errors.code && (
                        <Label className="text-destructive">
                            {errors.code?.message}
                        </Label>
                    )}
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
                            'Send'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};
