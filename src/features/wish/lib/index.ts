import {
    appendHeadersWithJsonContentType,
    getAuthorizedHeaders,
} from '@/shared/api/Fetch/headers';
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
    const headers = getAuthorizedHeaders();
    const response = await fetch(WISHES_ENDPOINT, {
        method: 'POST',
        headers: appendHeadersWithJsonContentType(headers),
        body: JSON.stringify({
            ...data,
            ownerId: userId,
        }),
    });

    if (!response.ok) {
        const error = (await response.json()) as { message: string };

        throw new Error(error.message);
    }

    const wish = (await response.json()) as Wish;

    return wish;
};

export const updateWish = async (
    wish: Partial<z.infer<typeof wishSchema>> & { isCompleted?: boolean },
    id: string,
) => {
    const headers = getAuthorizedHeaders();
    const response = await fetch(`${WISHES_ENDPOINT}/${id}`, {
        method: 'PATCH',
        headers: appendHeadersWithJsonContentType(headers),
        body: JSON.stringify(wish),
    });

    if (!response.ok) {
        throw new Error('');
    }

    const result = (await response.json()) as Wish;

    return result;
};

export const deleteWish = async (id: number) => {
    const headers = getAuthorizedHeaders();
    const response = await fetch(`${WISHES_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: appendHeadersWithJsonContentType(headers),
    });

    if (!response.ok) {
        throw new Error('');
    }

    const result = await response.json();

    return result;
};

export const reserveWish = async (id: number, reserverId: number) => {
    const headers = getAuthorizedHeaders();
    const response = await fetch(`${WISHES_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: appendHeadersWithJsonContentType(headers),
        body: JSON.stringify({ isReserved: true, reservedBy: reserverId }),
    });

    if (!response.ok) {
        throw new Error('');
    }

    const result = (await response.json()) as Wish;

    return result;
};

export const cancelReservedWish = async (id: number) => {
    const headers = getAuthorizedHeaders();
    const response = await fetch(`${WISHES_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: appendHeadersWithJsonContentType(headers),
        body: JSON.stringify({ isReserved: true, reservedBy: null }),
    });

    if (!response.ok) {
        throw new Error('');
    }

    const result = (await response.json()) as Wish;

    return result;
};
