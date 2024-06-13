'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { removeCategory } from '@/features/category/lib';
import { Category } from '@/shared/types/Category';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { RiDeleteBinLine } from '@remixicon/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const DeleteCategory = ({ category }: { category: Category }) => {
    const [isLoading, setIsLoading] = useState(false);
    const deleteViewerCategory = useViewerStore(state => state.removeCategory);

    const onClick = () => {
        setIsLoading(true);

        removeCategory(category.id)
            .then(() => {
                setIsLoading(false);

                deleteViewerCategory(category);
            })
            .catch(error => {
                setIsLoading(false);

                toast.error(error.message);
            });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <RiDeleteBinLine className="h-5 w-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The category will be
                        deleted permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            disabled={isLoading}
                            onClick={onClick}
                        >
                            <RiDeleteBinLine className="h-5 w-5" />
                            Delete category
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
