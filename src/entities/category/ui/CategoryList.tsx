import { useViewerStore } from '@/core/providers/ViewerProvider';
import { createCategory } from '@/features/category/lib';
import { Category as ICategory } from '@/shared/types/Category';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from './Category';
import { CategoryForm } from './CategoryForm';

type TempCategory = { name: string };

export const CategoryList = ({ items }: { items: ICategory[] }) => {
    const [tempCategories, setTempCategories] = useState<TempCategory[]>([]);
    const addCategory = useViewerStore(state => state.addCategory);

    const onAction = (data: TempCategory, index: number) => {
        if (Boolean(data.name)) {
            createCategory({ ...data })
                .then(item => {
                    addCategory(item);

                    setTempCategories(
                        tempCategories.filter((c, i) => i !== index),
                    );

                    toast.message('The category successfully created');
                })
                .catch(() => {
                    setTempCategories(tempCategories);

                    toast.message('The category failed to create');
                });
        }
    };

    return (
        <div className="flex w-full items-center justify-start gap-2">
            {items.map(category => (
                <Category key={category.name} category={category} />
            ))}
            {tempCategories.map((category, index) => (
                <CategoryForm
                    key={category.name}
                    onAction={item => onAction({ ...item }, index)}
                    onCancel={() =>
                        setTempCategories(
                            tempCategories.filter((c, i) => i !== index),
                        )
                    }
                />
            ))}
        </div>
    );
};
