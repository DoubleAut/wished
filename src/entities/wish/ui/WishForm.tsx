'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { Wish } from '@/shared/types/Wish';
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
import { useStore } from 'zustand';
import {
    createWish,
    getError,
    updateWish,
    wishSchema,
} from '../../../features/wish/lib';
import { viewWishStore } from '../model/wishStore';

interface Props {
    onCancel: () => void;
}

const deleteImage = async (key: string) => {
    const response = await axiosRequestWithBearer.delete(`/media/${key}`);

    if (response.status > 400) {
        throw new Error('Error while trying to delete an image');
    }

    return { success: true };
};

export const WishForm = (props: Props) => {
    const viewerStore = useViewerStore(state => state);
    const wishStore = useStore(viewWishStore);
    const [isLoading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof wishSchema>>({
        resolver: zodResolver(wishSchema),
        defaultValues: {
            title: wishStore.wish?.title ?? '',
            description: wishStore.wish?.description ?? '',
            price: wishStore.wish?.price ?? 0,
            canBeAnon: wishStore.wish?.canBeAnon ?? false,
            isHidden: wishStore.wish?.isHidden ?? false,
            picture: wishStore.wish?.picture ?? null,
        },
    });

    const isWishUpdate = Boolean(wishStore.wish?.id);

    const onSubmit = (result: z.infer<typeof wishSchema>) => {
        setLoading(true);

        if (!viewerStore.user) {
            setLoading(false);

            return;
        }

        const onSuccess = (newWish: Wish) => {
            if (!viewerStore.user) {
                return;
            }

            if (isWishUpdate) {
                const replacedWishes = viewerStore.user.wishes.map(wish =>
                    wish.id === newWish.id ? newWish : wish,
                );

                viewerStore.setWishes(replacedWishes);
            }

            if (!isWishUpdate) {
                viewerStore.setWishes([...viewerStore.user.wishes, newWish]);
            }

            const message = `${newWish.title} has been ${wishStore.wish?.id ? 'updated' : 'created'}.`;

            toast.success(message);

            wishStore.setWish(newWish);
            wishStore.setType('view');
        };

        const onError = (error: any) => {
            const { response } = error;

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

                if (!err) {
                    toast.error(error.message);
                }
            }
        };

        if (!wishStore.wish?.id) {
            createWish(result, viewerStore.user.id)
                .then(onSuccess)
                .catch(onError)
                .finally(() => setLoading(false));

            return;
        }

        if (wishStore.wish?.id) {
            updateWish(result, wishStore.wish.id)
                .then(onSuccess)
                .catch(onError)
                .finally(() => setLoading(false));

            return;
        }
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
                                        savedPicture={
                                            wishStore.wish
                                                ? {
                                                      key: wishStore.wish.picture
                                                          ?.split('/')
                                                          .at(-1) as string,
                                                      url: wishStore.wish
                                                          .picture as string,
                                                  }
                                                : undefined
                                        }
                                        onDelete={(key: string) => {
                                            setLoading(true);

                                            deleteImage(key)
                                                .then(() => {
                                                    field.onChange(null);
                                                })
                                                .catch(message =>
                                                    form.setError('picture', {
                                                        message,
                                                    }),
                                                )
                                                .finally(() =>
                                                    setLoading(false),
                                                );
                                        }}
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
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            aria-label="close"
                            onClick={() => {
                                wishStore.setType('view');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="outline"
                            type="submit"
                            className="w-full"
                        >
                            {isLoading && (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            )}

                            {!isLoading && isWishUpdate
                                ? 'Update the wish'
                                : 'Make a wish'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
