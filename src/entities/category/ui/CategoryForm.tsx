import { Category } from '@/shared/types/Category';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddLine, RiCloseLine } from '@remixicon/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    onAction: (item: Partial<Category> & { name: string }) => void;
    onCancel?: () => void;
    value?: string;
}

const categorySchema = z.object({
    name: z.string().min(1),
});

export const CategoryForm = ({ value, onAction, onCancel }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        formState: { errors },
        ...form
    } = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: value ?? '',
        },
    });

    const onSubmit = (data: z.infer<typeof categorySchema>) => {
        setIsLoading(true);

        onAction(data);

        setIsLoading(false);
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row"
        >
            <div className="flex flex-col gap-1">
                <Input
                    type="text"
                    className="w-full"
                    autoFocus
                    {...register('name')}
                />
                {errors.name && (
                    <Label className="text-destructive">
                        {errors.name?.message}
                    </Label>
                )}
            </div>
            <div className="flex w-fit flex-col items-center gap-2 lg:flex-row">
                <Button type="submit" disabled={isLoading}>
                    <RiAddLine className="h-4 w-4" />
                </Button>
                <Button type="reset" disabled={isLoading} onClick={onCancel}>
                    <RiCloseLine className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
};
