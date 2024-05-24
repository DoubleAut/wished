import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
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

export const createWish = async (
    wish: z.infer<typeof wishSchema>,
    userId: number,
) => {
    const response = await axiosRequestWithBearer.post('/wishes', {
        ...wish,
        isReserved: false,
        userId,
    });

    return response.data as Wish;
};

export const updateWish = async (
    wish: Partial<z.infer<typeof wishSchema>>,
    id: number,
) => {
    const response = await axiosRequestWithBearer.patch(`/wishes/${id}`, {
        ...wish,
        userId: id,
    });

    if (response.status > 400) {
        throw new Error('error while updating the wish');
    }

    return response.data as Wish;
};

export const deleteWish = async (id: number) => {
    const response = await axiosRequestWithBearer.delete(`/wishes/${id}`);

    if (response.status > 400) {
        throw new Error('error while updating the wish');
    }

    return response.data as Wish;
};

export const reserveWish = async (id: number) => {
    const response = await axiosRequestWithBearer.post(`/wishes/reserve/${id}`);

    if (response.status > 400) {
        throw new Error('error while updating the wish');
    }

    return response.data as Wish;
};

export const cancelReservedWish = async (id: number) => {
    const response = await axiosRequestWithBearer.delete(
        `/wishes/cancel/${id}`,
    );

    if (response.status > 400) {
        throw new Error('error while updating the wish');
    }

    return response.data as Wish;
};
