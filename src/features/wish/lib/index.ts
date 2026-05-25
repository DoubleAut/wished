import { patch, post, remove } from '@/shared/api/Fetch';
import { WISHES_ENDPOINT } from '@/shared/lib/constants/Config';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { queryClient } from '@/shared/lib/constants/Query/QueryClient';
import { Wish } from '@/shared/types/Wish';
import { z } from 'zod';

export const wishSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must contain atleast 2 characters',
    }),
    description: z.string().min(2, {
        message: 'Description must contain atleast 2 characters',
    }),
    price: z.coerce.number(),
    isHidden: z.boolean(),
    canBeAnon: z.boolean(),
    picture: z.string().nullable(),
    categoryId: z.number().nullable(),
    giftDay: z
        .date()
        .refine(date => date.toISOString())
        .nullable(),
});

export const getError = (message: string) => {
    if (message.split(' ').includes('title')) {
        return 'title';
    }
    if (message.split(' ').includes('description')) {
        return 'description';
    }
    if (message.split(' ').includes('price')) {
        return 'price';
    }

    return null;
};

type WishResponse = { message: string; wish: Wish };

export const createWish = async (
    data: z.infer<typeof wishSchema>,
    userId: string,
) => {
    const response = await post<{}, WishResponse>(
        WISHES_ENDPOINT,
        [],
        {
            ...data,
            ownerId: userId,
        },
        true,
    );

    queryClient.invalidateQueries({ queryKey: [WISHES_TAG] });

    return response.wish;
};

export const updateWish = async (
    wish: Partial<z.infer<typeof wishSchema>> & { isCompleted?: boolean },
    wishId: string,
) => {
    const response = await patch<{}, WishResponse>(
        `${WISHES_ENDPOINT}/${wishId}`,
        [],
        wish,
        true,
    );

    return response.wish;
};

export const deleteWish = async (id: string) => {
    const response = await remove(`${WISHES_ENDPOINT}/${id}`, [], true);

    return response;
};

export const reserveWish = async (id: string, reservedBy: string) => {
    const response = await patch<{}, WishResponse>(
        `${WISHES_ENDPOINT}/${id}`,
        [],
        { reservedBy },
        true,
    );

    return response.wish;
};

export const cancelReservedWish = async (id: string) => {
    const response = await patch<{}, WishResponse>(
        `${WISHES_ENDPOINT}/${id}`,
        [],
        { reservedBy: 'None' },
        true,
    );

    return response.wish;
};
