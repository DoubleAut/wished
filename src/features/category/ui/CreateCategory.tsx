'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { createCategory } from '@/features/category/lib';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { RiAddLine } from '@remixicon/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const CreateCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState<'create' | 'idle'>('idle');
    const [name, setName] = useState('');
    const createViewerCategory = useViewerStore(state => state.addCategory);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setName(e.target.value);

    const onSumbit = () => {
        setIsLoading(true);

        createCategory({ name })
            .then(newCategory => {
                setIsLoading(false);
                setState('idle');

                createViewerCategory(newCategory);
            })
            .catch(error => {
                setIsLoading(false);

                toast.error(error.message);
            });
    };

    return (
        <div className="flex">
            {state === 'create' && (
                <div className="flex gap-2">
                    <Input
                        className="w-full"
                        placeholder="Category name"
                        onChange={handleChange}
                    />
                    <Button variant="outline" onClick={onSumbit}>
                        <RiAddLine className="h-5 w-5" />
                        Create category
                    </Button>
                </div>
            )}

            {state === 'idle' && (
                <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => setState('create')}
                >
                    <RiAddLine className="h-5 w-5" />
                    Create category
                </Button>
            )}
        </div>
    );
};
