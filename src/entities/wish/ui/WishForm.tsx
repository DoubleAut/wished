'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { CategorySelect } from '@/entities/category/ui/CategorySelect';
import {
    createWish,
    getError,
    updateWish,
    wishSchema,
} from '@/features/wish/lib';
import { dialogStore } from '@/features/wish/model/dialogView';
import { cn } from '@/shared/lib/classNames/cn';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { UploadSwitch } from '@/shared/ui/uploadSwitch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useStore } from 'zustand';
import type { Wish } from '../../../../shared/types/Wish';
import { getDefaultValues, getImageObject } from '../lib/helpers';

type FieldErrorKey = 'title' | 'description' | 'price' | null;

function toMessages(msg: string | string[] | undefined): string[] {
    if (msg == null) return [];
    return Array.isArray(msg) ? msg : [msg];
}

// ─── Section wrapper ───────────────────────────────────────────

interface SectionProps {
    icon: string;
    title: string;
    children: ReactNode;
    className?: string;
}

const FormSection = ({ icon, title, children, className }: SectionProps) => (
    <div
        className={cn(
            'bg-card ring-accent/20 flex flex-col gap-4 rounded-2xl p-5 ring-1 sm:p-6',
            className,
        )}
    >
        <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-hidden="true">
                {icon}
            </span>
            <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

// ─── Field group ───────────────────────────────────────────────

interface FieldGroupProps {
    label: string;
    error?: { message?: string };
    children: ReactNode;
    id?: string;
    helperText?: string;
}

const FieldGroup = ({
    label,
    error,
    children,
    id,
    helperText,
}: FieldGroupProps) => (
    <div className="flex flex-col gap-1.5">
        <Label htmlFor={id} className="text-foreground/80 text-sm font-medium">
            {label}
        </Label>
        {children}
        {helperText && !error && (
            <p className="text-muted-foreground/70 text-xs">{helperText}</p>
        )}
        {error?.message && (
            <p className="text-destructive text-xs font-medium">
                {error.message}
            </p>
        )}
    </div>
);

// ─── Price input with $ prefix ─────────────────────────────────

interface PriceInputProps {
    value?: number;
    onChange: (value: number) => void;
    error?: { message?: string };
}

const PriceInput = ({ value, onChange, error }: PriceInputProps) => (
    <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
            $
        </span>
        <Input
            type="number"
            step="0.01"
            min="0"
            value={value ?? ''}
            onChange={e => onChange(Number(e.target.value))}
            className={cn(
                'pl-7',
                error?.message && 'border-destructive ring-destructive/30',
            )}
            placeholder="0.00"
        />
    </div>
);

// ─── Switch row ────────────────────────────────────────────────

interface SwitchRowProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const SwitchRow = ({
    id,
    label,
    description,
    checked,
    onCheckedChange,
}: SwitchRowProps) => (
    <div className="bg-background/60 flex items-start justify-between gap-4 rounded-xl p-4">
        <div className="space-y-0.5">
            <Label
                htmlFor={id}
                className="text-foreground/80 text-sm font-medium"
            >
                {label}
            </Label>
            <p className="text-muted-foreground/70 text-xs">{description}</p>
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
);

// ─── Main form ─────────────────────────────────────────────────

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

        setOpen(false);

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

    const handleDeleteImage = (_key: string) => {
        // TODO: implement image deletion when backend supports it
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-5 sm:p-6"
        >
            {/* Hero image + basic info — side by side on desktop */}
            <div className="grid gap-6 sm:grid-cols-5">
                {/* Image upload — hero zone */}
                <div className="sm:col-span-2">
                    <div className="space-y-2">
                        <Label className="text-foreground/80 text-sm font-medium">
                            Picture
                        </Label>
                        <div className="border-accent/30 bg-accent/[0.03] hover:border-accent/50 overflow-hidden rounded-2xl border-2 border-dashed transition-colors">
                            <UploadSwitch
                                savedPicture={
                                    dialogWish?.picture
                                        ? getImageObject(dialogWish.picture)
                                        : undefined
                                }
                                onDelete={handleDeleteImage}
                                onError={message =>
                                    setError('picture', { message })
                                }
                                onUploadComplete={url => {
                                    setValue('picture', url);
                                    setLoading(false);
                                }}
                                onUploading={() => setLoading(true)}
                            />
                        </div>
                        <p className="text-muted-foreground/60 text-center text-xs">
                            Drop a photo of your wish
                        </p>
                    </div>
                </div>

                {/* What's your wish? */}
                <div className="space-y-4 sm:col-span-3">
                    <FormSection icon="🎁" title="What's your wish?">
                        <FieldGroup
                            label="Title"
                            error={errors.title}
                            id="title"
                            helperText="What do you want?"
                        >
                            <Input
                                {...register('title')}
                                id="title"
                                placeholder="A cozy blanket, a new book..."
                                className={cn(
                                    errors.title &&
                                        'border-destructive ring-destructive/30',
                                )}
                            />
                        </FieldGroup>

                        <FieldGroup
                            label="Description"
                            error={errors.description}
                            id="description"
                            helperText="Tell a story — why do you want this?"
                        >
                            <Input
                                {...register('description')}
                                id="description"
                                placeholder="I've been looking for the perfect one..."
                                className={cn(
                                    errors.description &&
                                        'border-destructive ring-destructive/30',
                                )}
                            />
                        </FieldGroup>

                        <FieldGroup
                            label="Category"
                            error={errors.categoryId}
                            id="category"
                        >
                            <CategorySelect
                                onChange={value =>
                                    setValue('categoryId', Number(value))
                                }
                                value={String(watch('categoryId') ?? '')}
                            />
                        </FieldGroup>
                    </FormSection>
                </div>
            </div>

            {/* The details */}
            <FormSection icon="💰" title="The details">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup
                        label="Price"
                        error={errors.price}
                        id="price"
                        helperText="How much does it cost?"
                    >
                        <PriceInput
                            value={watch('price')}
                            onChange={value => setValue('price', value)}
                            error={errors.price}
                        />
                    </FieldGroup>

                    <FieldGroup
                        label="Gift day"
                        error={errors.giftDay}
                        id="giftDay"
                        helperText="When would you like it?"
                    >
                        <DatePicker
                            selected={watch('giftDay') ?? null}
                            onSelect={date => setValue('giftDay', date ?? null)}
                        />
                    </FieldGroup>
                </div>
            </FormSection>

            {/* Privacy */}
            <FormSection icon="🔒" title="Privacy">
                <div className="space-y-3">
                    <SwitchRow
                        id="canBeAnon"
                        label="Allow anonymous gifting"
                        description="Someone can reserve this without revealing who they are — nice for surprises!"
                        checked={watch('canBeAnon')}
                        onCheckedChange={checked =>
                            setValue('canBeAnon', checked)
                        }
                    />
                    <SwitchRow
                        id="isHidden"
                        label="Hide from others"
                        description="Keep this wish private — only you can see it on your list."
                        checked={watch('isHidden')}
                        onCheckedChange={checked =>
                            setValue('isHidden', checked)
                        }
                    />
                </div>
            </FormSection>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1 gap-2 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Making a wish...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            {isWishUpdate ? 'Save changes' : 'Make a wish'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
