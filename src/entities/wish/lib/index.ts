import { get, remove } from '@/shared/api/Fetch';
import {
    ARCHIVED_TAG,
    GIFTED_TAG,
    RESERVATIONS_TAG,
    WISHES_TAG,
} from '@/shared/lib/constants/FetchTags';
import { Wish } from '@/shared/types/Wish';

export interface WishesPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MyWishesPaginatedResponse {
    items: Wish[];
    pagination: WishesPagination;
}

const LIMIT = 9;

export const getMyWishesPaginated = async (page: number, limit = LIMIT) => {
    const response = await get<MyWishesPaginatedResponse>(
        `/wishes/me?page=${page}&limit=${limit}`,
        [WISHES_TAG],
        true,
    );

    return response;
};

export const getMyReservationsPaginated = async (
    page: number,
    limit = LIMIT,
) => {
    const response = await get<MyWishesPaginatedResponse>(
        `/wishes/me/reservations?page=${page}&limit=${limit}`,
        [RESERVATIONS_TAG],
        true,
    );

    return response;
};

export const getMyGiftedPaginated = async (page: number, limit = LIMIT) => {
    const response = await get<MyWishesPaginatedResponse>(
        `/wishes/me/gifted?page=${page}&limit=${limit}`,
        [GIFTED_TAG],
        true,
    );

    return response;
};

export const getMyArchivedPaginated = async (page: number, limit = LIMIT) => {
    const response = await get<MyWishesPaginatedResponse>(
        `/wishes/me/archived?page=${page}&limit=${limit}`,
        [ARCHIVED_TAG],
        true,
    );

    return response;
};

// interface WishesAndReservations {
//     wishes: Wish[];
//     reservations: Wish[];
//     gifted: Wish[];
//     completed: Wish[];
// }

// export const getOwnWishes = async (userId: number) => {
//     const response = await get<WishesAndReservations>(
//         `/wishes/own/${userId}`,
//         ['wishes', 'reservations'],
//         true,
//     );

//     return response;
// };

// export const getUserWishes = async (userId: number) => {
//     const response = await get<Wish[]>(`/wishes/${userId}`, ['wishes']);

//     return response;
// };

export const deleteImage = async (key: string) => {
    await remove(`/media/${key}`, [WISHES_TAG], true);

    return { success: true };
};
