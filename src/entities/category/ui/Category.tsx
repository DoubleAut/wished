import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Toggle } from '@/shared/ui/toggle';
import { Category as ICategory } from '../../../../shared/types/Category';

export const Category = ({ category }: { category: ICategory }) => {
    const selectedCategory = useViewerStore(state => state.selectedCategory);
    const selectCategory = useViewerStore(state => state.selectCategory);
    const isSelected = selectedCategory?.id === category.id;

    const onClick = () =>
        !isSelected ? selectCategory(category) : selectCategory(null);

    return (
        <Toggle
            className="w-fit whitespace-nowrap rounded-full capitalize"
            onClick={onClick}
        >
            {category.name}
        </Toggle>
    );
};
