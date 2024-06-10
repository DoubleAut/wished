import { Category } from '@/shared/types/Category';
import { GlobalStore } from '@/shared/types/GlobalStore';
import { StateCreator } from 'zustand';

export interface CategorySlice {
    categories: Category[];
    isVisible: boolean;
    selectedCategory: Category | null;
    addCategory: (wish: Category) => void;
    removeCategory: (wish: Category) => void;
    updateCategory: (wish: Category) => void;
    setCategories: (categories: Category[]) => void;
    selectCategory: (category: Category | null) => void;
    setVisible: (isVisible: boolean) => void;
}

export const createCategorySlice: StateCreator<
    GlobalStore,
    [],
    [],
    CategorySlice
> = (set, get) => ({
    categories: [],
    selectedCategory: null,
    isVisible: false,
    setCategories: categories => {
        set({ categories });
    },
    selectCategory: selectedCategory => set({ selectedCategory }),
    setVisible: isVisible => set({ isVisible }),
    addCategory: category => {
        const state = get();

        set({ categories: [...state.categories, category] });
    },
    removeCategory: category => {
        const state = get();

        set({
            categories: state.categories.filter(
                item => item.id !== category.id,
            ),
        });
    },
    updateCategory: category => {
        const state = get();

        set({
            categories: state.categories.map(item =>
                item.id === category.id ? category : item,
            ),
        });
    },
});
