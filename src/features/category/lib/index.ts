import { get, patch, post, remove } from '@/shared/api/Fetch';
import { CATEGORIES_TAG } from '@/shared/lib/constants/FetchTags';
import { Category } from '@/shared/types/Category';

export const getCategories = (id: number) => {
    const response = get<Category[]>(`/category/${id}`, [CATEGORIES_TAG], true);

    return response;
};

type NewCategory = Omit<Category, 'owner' | 'id'>;

export const createCategory = (data: NewCategory) => {
    const response = post<NewCategory, Category>(
        '/category/',
        [CATEGORIES_TAG],
        data,
        true,
    );

    return response;
};

type UpdateCategory = Omit<Category, 'owner'>;

export const updateCategory = (data: UpdateCategory) => {
    const response = patch<NewCategory, Category>(
        `/category/${data.id}`,
        [CATEGORIES_TAG],
        data,
        true,
    );

    return response;
};

export const removeCategory = (id: number) => {
    const response = remove<Category>(
        `/category/${id}`,
        [CATEGORIES_TAG],
        true,
    );

    return response;
};
