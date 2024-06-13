import { useViewerStore } from '@/core/providers/ViewerProvider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

interface Props {
    onChange: (categoryId: string) => void;
    value?: string;
}

export const CategorySelect = ({ onChange, value }: Props) => {
    const categories = useViewerStore(state => state.categories);

    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map(category => (
                    <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
