'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { updateCategory } from '@/features/category/lib';
import { Category } from '@/shared/types/Category';
import { Button } from '@/shared/ui/button';
import { RiEditLine } from '@remixicon/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const UpdateCategory = ({ category }: { category: Category }) => {
    const [isLoading, setIsLoading] = useState(false);
    const updateViewerCategory = useViewerStore(state => state.updateCategory);

    const onSubmit = () => {
        setIsLoading(true);

        updateCategory(category)
            .then(updatedCategory => {
                setIsLoading(false);

                updateViewerCategory(updatedCategory);
            })
            .catch(error => {
                setIsLoading(false);

                toast.error(error.message);
            });
    };

    return (
        <div className="flex">
            <Button variant="outline" disabled={isLoading} onClick={onSubmit}>
                <RiEditLine className="h-4 w-4" />
            </Button>
        </div>
    );
};
