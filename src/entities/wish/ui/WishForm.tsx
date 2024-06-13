'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { CategorySelect } from '@/entities/category/ui/CategorySelect';
import { dialogStore } from '@/features/wish/model/dialogView';
import { Wish } from '@/shared/types/Wish';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
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
import { deleteImage } from '../lib';
import { getDefaultValues, getImageObject } from '../lib/helpers';

interface Props {
    onCancel: () => void;
}

export const WishForm = ({ onCancel }: Props) => {
    const user = useViewerStore(state => state.user);
    const dialogWishStore = useStore(dialogStore);
    const dialogWish = dialogWishStore.dialogWish;
    const setDialogWish = dialogWishStore.setDialogWish;
    const setOpen = dialogWishStore.setOpen;

    const updateExistingWish = useViewerStore(state => state.updateWish);
    const addWish = useViewerStore(state => state.addWish);

    const [isLoading, setLoading] = useState(false);

    const {
        register,
        formState: { errors },
        ...form
    } = useForm<z.infer<typeof wishSchema>>({
        resolver: zodResolver(wishSchema),
        defaultValues: getDefaultValues(dialogWish),
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

            setDialogWish(newWish, 'view');
            setOpen(true);
        };

        const onFormError = (error: any) => {
            for (let message of error.message) {
                const err = getError(message) as
                    | 'title'
                    | 'description'
                    | 'price'
                    | null;

                if (err) {
                    form.setError(err, { message });
                }
            }
        };

        const onStatusError = (error: any) => {
            const message = error.message;
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
        };

        const onError = (error: any) => {
            Array.isArray(error.message)
                ? onFormError(error)
                : onStatusError(error);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2">
                    <Label>Title</Label>
                    <Input {...register('title')} />
                    {errors.title && (
                        <Label className="text-destructive">
                            {errors.title.message}
                        </Label>
                    )}
                </div>
                <div className="flex flex-col items-start gap-2">
                    <Label>Description</Label>
                    <Input {...register('description')} />
                    {errors.description && (
                        <Label className="text-destructive">
                            {errors.description.message}
                        </Label>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-start gap-2">
                        <Label>Description</Label>
                        <Input type="number" {...register('price')} />
                        {errors.price && (
                            <Label className="text-destructive">
                                {errors.price.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Label>Gift day</Label>
                        <DatePicker
                            selected={form.watch('giftDay') ?? null}
                            onSelect={date =>
                                form.setValue('giftDay', date ?? null)
                            }
                        />
                        {errors.giftDay && (
                            <Label className="text-destructive">
                                {errors.giftDay.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Label>Category</Label>
                        <CategorySelect
                            onChange={value =>
                                form.setValue('categoryId', Number(value))
                            }
                        />
                        {errors.categoryId && (
                            <Label className="text-destructive">
                                {errors.categoryId.message}
                            </Label>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <Switch id="canBeAnon" {...register('canBeAnon')} />
                        <Label htmlFor="canBeAnon">Can be anonymous</Label>
                        {errors.canBeAnon && (
                            <Label className="text-destructive">
                                {errors.canBeAnon.message}
                            </Label>
                        )}
                    </div>
                    <div className="flex items-center  gap-2">
                        <Switch id="isHidden" {...register('isHidden')} />
                        <Label htmlFor="isHidden">Hide gift</Label>
                        {errors.isHidden && (
                            <Label className="text-destructive">
                                {errors.isHidden.message}
                            </Label>
                        )}
                    </div>
                </div>
                <div className="flex justify-center">
                    <UploadSwitch
                        savedPicture={
                            dialogWish?.picture
                                ? getImageObject(dialogWish.picture)
                                : undefined
                        }
                        onDelete={(key: string) => {
                            setLoading(true);

                            deleteImage(key)
                                .then(() => {
                                    form.setValue('picture', null);
                                })
                                .catch(message =>
                                    form.setError('picture', {
                                        message,
                                    }),
                                )
                                .finally(() => setLoading(false));
                        }}
                        onError={message =>
                            form.setError('picture', {
                                message,
                            })
                        }
                        onUploadComplete={url => {
                            form.setValue('picture', url);

                            setLoading(false);
                        }}
                        onUploading={() => setLoading(true)}
                    />
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onCancel}
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

                        {!isLoading && (
                            <>
                                {isWishUpdate
                                    ? 'Update the wish'
                                    : 'Make a wish'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};
