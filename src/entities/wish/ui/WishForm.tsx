'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { CategorySelect } from '@/entities/category/ui/CategorySelect';
import {
    createWish,
    getError,
    updateWish,
    wishSchema,
} from '@/features/wish/lib';
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
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useStore } from 'zustand';
import { deleteImage } from '../lib';
import { getDefaultValues, getImageObject } from '../lib/helpers';

type FieldErrorKey = 'title' | 'description' | 'price' | null;

function toMessages(msg: string | string[] | undefined): string[] {
    if (msg == null) return [];
    return Array.isArray(msg) ? msg : [msg];
}

interface FieldGroupProps {
    label: string;
    error?: { message?: string };
    children: ReactNode;
    id?: string;
    layout?: 'vertical' | 'horizontal';
}

const FieldGroup = ({
    label,
    error,
    children,
    id,
    layout = 'vertical',
}: FieldGroupProps) => {
    const labelEl = <Label htmlFor={id}>{label}</Label>;
    const errorEl = error?.message ? (
        <Label className="text-destructive">{error.message}</Label>
    ) : null;

    if (layout === 'horizontal') {
        return (
            <div className="flex items-center gap-2">
                {children}
                {labelEl}
                {errorEl}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-2">
            {labelEl}
            {children}
            {errorEl}
        </div>
    );
};

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
}

export const WishForm = ({ onCancel, onSuccess }: Props) => {
    const user = useViewerStore(state => state.user);
    const { dialogWish, setDialogWish, setOpen } = useStore(dialogStore);
    const [isLoading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof wishSchema>>({
        resolver: zodResolver(wishSchema),
        defaultValues: getDefaultValues(dialogWish),
    });

    const {
        register,
        formState: { errors },
        watch,
        setValue,
        setError,
        handleSubmit,
    } = form;
    const isWishUpdate = Boolean(dialogWish?.id);

    const setFieldErrorFromMessage = (message: string) => {
        const field = getError(message) as FieldErrorKey;
        if (field) {
            setError(field, { message });
        } else {
            toast.error(message);
        }
    };

    const handleSubmitError = (error: { message?: string | string[] }) => {
        toMessages(error.message).forEach(setFieldErrorFromMessage);
    };

    const onWishSuccess = (newWish: Wish) => {
        toast.success(
            `${newWish.title} has been ${isWishUpdate ? 'updated' : 'created'}.`,
        );
        setDialogWish(newWish, 'view');
        setOpen(true);

        onSuccess();
    };

    const onSubmit = (result: z.infer<typeof wishSchema>) => {
        if (!user) return;

        setLoading(true);
        const promise =
            isWishUpdate && dialogWish?.id
                ? updateWish(result, dialogWish.id)
                : createWish(result, user.id);

        promise
            .then(onWishSuccess)
            .catch(handleSubmitError)
            .finally(() => setLoading(false));
    };

    const handleDeleteImage = (key: string) => {
        setLoading(true);
        deleteImage(key)
            .then(() => setValue('picture', null))
            .catch(message => setError('picture', { message }))
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <FieldGroup label="Title" error={errors.title}>
                    <Input {...register('title')} />
                </FieldGroup>

                <FieldGroup label="Description" error={errors.description}>
                    <Input {...register('description')} />
                </FieldGroup>

                <div className="grid grid-cols-3 gap-2">
                    <FieldGroup label="Price" error={errors.price}>
                        <Input type="number" {...register('price')} />
                    </FieldGroup>
                    <FieldGroup label="Gift day" error={errors.giftDay}>
                        <DatePicker
                            selected={watch('giftDay') ?? null}
                            onSelect={date => setValue('giftDay', date ?? null)}
                        />
                    </FieldGroup>
                    <FieldGroup label="Category" error={errors.categoryId}>
                        <CategorySelect
                            onChange={value =>
                                setValue('categoryId', Number(value))
                            }
                        />
                    </FieldGroup>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <FieldGroup
                        label="Can be anonymous"
                        error={errors.canBeAnon}
                        layout="horizontal"
                    >
                        <Switch id="canBeAnon" {...register('canBeAnon')} />
                    </FieldGroup>
                    <FieldGroup
                        label="Hide gift"
                        error={errors.isHidden}
                        layout="horizontal"
                    >
                        <Switch id="isHidden" {...register('isHidden')} />
                    </FieldGroup>
                </div>

                <div className="flex justify-center">
                    <UploadSwitch
                        savedPicture={
                            dialogWish?.picture
                                ? getImageObject(dialogWish.picture)
                                : undefined
                        }
                        onDelete={handleDeleteImage}
                        onError={message => setError('picture', { message })}
                        onUploadComplete={url => {
                            setValue('picture', url);
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
                        {!isLoading &&
                            (isWishUpdate ? 'Update the wish' : 'Make a wish')}
                    </Button>
                </div>
            </div>
        </form>
    );
};
