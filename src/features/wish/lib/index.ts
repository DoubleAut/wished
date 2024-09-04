import { patch, post, remove } from '@/shared/api/Fetch';
import { z } from 'zod';
import { Wish } from '../../../../shared/types/Wish';
import { WISHES_ENDPOINT } from './api';

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

export const createWish = async (
    data: z.infer<typeof wishSchema>,
    userId: string,
) => {
    const wish = await post<{}, Wish>(
        WISHES_ENDPOINT + '/wishes',
        [],
        {
            ...data,
            ownerId: userId,
        },
        true,
    );

    return wish;
};

export const updateWish = async (
    wish: Partial<z.infer<typeof wishSchema>> & { isCompleted?: boolean },
    wishId: string,
) => {
    const updatedWish = await patch(WISHES_ENDPOINT + wishId, [], wish, true);

    return updatedWish as Wish;
};

export const deleteWish = async (id: string) => {
    const response = await remove(WISHES_ENDPOINT + id, [], true);

    return response;
};

export const reserveWish = async (id: string, reserverId: string) => {
    const wish = await patch(
        WISHES_ENDPOINT + id,
        [],
        { reservedBy: reserverId },
        true,
    );

    return wish as Wish;
};

export const cancelReservedWish = async (id: string) => {
    const wish = await patch(
        WISHES_ENDPOINT + id,
        [],
        { reservedBy: null },
        true,
    );

    return wish;
};
