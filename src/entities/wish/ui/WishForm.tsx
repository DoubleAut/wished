'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { dialogStore } from '@/features/wish/model/dialogView';
import { remove } from '@/shared/api/Fetch';
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

interface Props {
    onCancel: () => void;
}

const deleteImage = async (key: string) => {
    const response = await remove(`/media/${key}`);

    return { success: true };
};

export const WishForm = (props: Props) => {
    const user = useViewerStore(state => state.user);
    const dialogWishStore = useStore(dialogStore);
    const dialogWish = dialogWishStore.dialogWish;
    const setDialogWish = dialogWishStore.setDialogWish;

    const updateExistingWish = useViewerStore(state => state.updateWish);
    const addWish = useViewerStore(state => state.addWish);

    const [isLoading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof wishSchema>>({
        resolver: zodResolver(wishSchema),
        defaultValues: {
            title: dialogWish?.title ?? '',
            description: dialogWish?.description ?? '',
            price: dialogWish?.price ?? 0,
            canBeAnon: dialogWish?.canBeAnon ?? false,
            isHidden: dialogWish?.isHidden ?? false,
            picture: dialogWish?.picture ?? null,
        },
    });

    const isWishUpdate = Boolean(dialogWish?.id);

    const onSubmit = (result: z.infer<typeof wishSchema>) => {
        setLoading(true);

        if (!user) {
            setLoading(false);

            return;
        }

        const onSuccess = (newWish: Wish) => {
            if (!user) {
                return;
            }

            if (isWishUpdate) {
                updateExistingWish(newWish);
            }

            if (!isWishUpdate) {
                addWish(newWish);
            }

            const message = `${newWish.title} has been ${dialogWish?.id ? 'updated' : 'created'}.`;

            toast.success(message);

            setDialogWish(newWish, 'edit');
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

        if (!dialogWish?.id) {
            createWish(result, user.id)
                .then(onSuccess)
                .catch(onError)
                .finally(() => setLoading(false));

            return;
        }

        if (dialogWish.id) {
            updateWish(result, dialogWish.id)
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
                                            dialogWish
                                                ? {
                                                      key: dialogWish.picture
                                                          ?.split('/')
                                                          .at(-1) as string,
                                                      url: dialogWish.picture as string,
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
                                setDialogWish(dialogWish, 'view');
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
