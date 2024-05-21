'use client';

import { useUserStore } from '@/core/providers/UserProvider';
import { UserStore } from '@/entities/user/model/userStore';
import { Button } from '@/shared/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { UploadSwitch } from '@/shared/ui/uploadSwitch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createWish, getError, wishSchema } from '../lib';

interface Props {
    onCancel: () => void;
}

export const WishForm = ({ onCancel }: Props) => {
    const store = useUserStore<UserStore>(state => state);
    const [isLoading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof wishSchema>>({
        resolver: zodResolver(wishSchema),
        defaultValues: {
            picture: null,
            isHidden: false,
            canBeAnon: false,
        },
    });

    const onSubmit = (result: z.infer<typeof wishSchema>) => {
        setLoading(true);

        if (!store.user) {
            setLoading(false);

            return;
        }

        createWish(result, store.user.id)
            .then(newWish => {
                onCancel();

                if (!store.user) {
                    return;
                }

                store.setWishes([...store.user.wishes, newWish]);

                const message = `${newWish.title} has been created.`;

                toast(message);
            })
            .catch(err => {
                const { response } = err;

                if (Array.isArray(response.data.message)) {
                    for (let message of response.data.message) {
                        const err = getError(message) as
                            | 'title'
                            | 'description'
                            | 'price'
                            | null;

                        if (err) {
                            form.setError(err, { message });
                        }
                    }
                } else {
                    const message = response.data.message;
                    const err = getError(message) as
                        | 'title'
                        | 'description'
                        | 'price'
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage className="capitalize" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Type your description here"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="capitalize" />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-2/3 flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <FormField
                                control={form.control}
                                name="canBeAnon"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <Label>May be anon</Label>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isHidden"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <Label>Only I can see</Label>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="picture"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <UploadSwitch
                                        onDelete={() => field.onChange(null)}
                                        onError={message =>
                                            form.setError('picture', {
                                                message,
                                            })
                                        }
                                        onUploadComplete={url => {
                                            field.onChange(url);

                                            setLoading(false);
                                        }}
                                        onUploading={() => setLoading(true)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        type="submit"
                        className="w-full"
                        aria-label="close"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            'Make a wish'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
