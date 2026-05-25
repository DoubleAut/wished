import { get, remove } from '@/shared/api/Fetch';
import { WISHES_ENDPOINT } from '@/shared/lib/constants/Config';
import {
    ARCHIVED_TAG,
    GIFTED_TAG,
    RESERVATIONS_TAG,
    WISHES_TAG,
} from '@/shared/lib/constants/FetchTags';
import type { Wish } from '../../../../shared/types/Wish';

interface WishesListResponse {
    message: string;
    wishes: Wish[];
}

const LIMIT = 9;

const paginate = (items: Wish[], page: number, limit: number) => {
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        items: items.slice(start, end),
        pagination: {
            page,
            limit,
            total: items.length,
            totalPages: Math.ceil(items.length / limit),
        },
    };
};

export const getMyWishesPaginated = async (
    ownerId: string,
    page: number,
    limit = LIMIT,
) => {
    const response = await get<WishesListResponse>(
        `${WISHES_ENDPOINT}/list/${ownerId}`,
        [WISHES_TAG],
        true,
    );

    return paginate(response.wishes, page, limit);
};

export const getReservations = async (userId: string) => {
    const response = await get<WishesListResponse>(
        `${WISHES_ENDPOINT}/reservations/${userId}`,
        [],
    );

    return response.wishes;
};

export const getMyReservationsPaginated = async (
    userId: string,
    page: number,
    limit = LIMIT,
) => {
    const response = await get<WishesListResponse>(
        `${WISHES_ENDPOINT}/reservations/${userId}`,
        [RESERVATIONS_TAG],
        true,
    );

    return paginate(response.wishes, page, limit);
};

export const getMyGiftedPaginated = async (
    ownerId: string,
    page: number,
    limit = LIMIT,
) => {
    const response = await get<WishesListResponse>(
        `${WISHES_ENDPOINT}/list/${ownerId}`,
        [GIFTED_TAG],
        true,
    );

    const gifted = response.wishes.filter(wish => wish.status === 'gifted');

    return paginate(gifted, page, limit);
};

export const getMyArchivedPaginated = async (
    ownerId: string,
    page: number,
    limit = LIMIT,
) => {
    const response = await get<WishesListResponse>(
        `${WISHES_ENDPOINT}/list/${ownerId}`,
        [ARCHIVED_TAG],
        true,
    );

    const archived = response.wishes.filter(wish => wish.status === 'archived');

    return paginate(archived, page, limit);
};

// interface WishesAndReservations {
//     wishes: Wish[];
//     reservations: Wish[];
//     gifted: Wish[];
//     completed: Wish[];
// }

// export const getOwnWishes = async (userId: number) => {
//     const response = await get<WishesAndReservations>(
//         `${WISHES_ENDPOINT}/own/${userId}`,
//         ['wishes', 'reservations'],
//         true,
//     );

//     return response;
// };

// export const getUserWishes = async (userId: number) => {
//     const response = await get<Wish[]>(`${WISHES_ENDPOINT}/${userId}`, ['wishes']);

//     return response;
// };

export const deleteImage = async (key: string) => {
    await remove(`/media/${key}`, [WISHES_TAG], true);

    return { success: true };
};
