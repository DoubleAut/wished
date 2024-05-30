import { patch, post, remove } from '@/shared/api/Fetch';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
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

type CreateProps = z.infer<typeof wishSchema> & {
    userId: number;
    isReserved: boolean;
};

export const createWish = async (
    wish: z.infer<typeof wishSchema>,
    userId: number,
) => {
    const response = await post<CreateProps, Wish>(
        `/wishes`,
        [WISHES_TAG],
        { ...wish, userId, isReserved: false },
        true,
    );

    return response as Wish;
};

export const updateWish = async (
    wish: Partial<z.infer<typeof wishSchema>>,
    id: number,
) => {
    const response = await patch<typeof wish, Wish>(
        `/wishes/${id}`,
        [WISHES_TAG],
        wish,
        true,
    );

    return response;
};

export const deleteWish = async (id: number) => {
    const response = await remove<Wish>(`/wishes/${id}`, [WISHES_TAG], true);

    return response;
};

export const reserveWish = async (id: number) => {
    const response = await patch<{}, Wish>(
        `/wishes/reserve/${id}`,
        [WISHES_TAG],
        {},
        true,
    );

    return response;
};

export const cancelReservedWish = async (id: number) => {
    const response = await remove<Wish>(
        `/wishes/cancel/${id}`,
        [WISHES_TAG],
        true,
    );

    return response;
};
