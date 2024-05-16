import { axiosRequestWithBearer } from '@/shared/lib/axios/axiosRequest';
import { Wish } from '@/shared/types/Wish';
import { z } from 'zod';

interface WishData extends Partial<Wish> {}

export interface WishSchema {
    title: string;
    description: string;
    price: number;
    isHidden: boolean;
    canBeAnon: boolean;
}

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

export const createWish = async (wish: WishData, userId: number) => {
    const response = await axiosRequestWithBearer.post('/wishes', {
        ...wish,
        isReserved: false,
        userId,
    });

    return response.data as Wish;
};

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
});
