import { Category } from '@/shared/types/Category';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddLine } from '@remixicon/react';
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
            className="flex w-full items-center justify-center gap-2"
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
            <Button type="submit" disabled={isLoading}>
                <RiAddLine className="mr-2 h-4 w-4" />
                Create
            </Button>
        </form>
    );
};
