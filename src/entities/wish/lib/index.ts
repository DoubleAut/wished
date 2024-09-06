import { WISHES_ENDPOINT } from '@/features/wish/lib/api';
import { get, remove } from '@/shared/api/Fetch';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { Wish } from '../../../../shared/types/Wish';

type GetWishesResponse = { message: string; wishes: Wish[] };

export const getWishes = async (userId: string) => {
    const response = await get<GetWishesResponse>(
        `${WISHES_ENDPOINT}/list/${userId}`,
        [],
    );

    return response.wishes;
};

const reservationsEndpoint = `${WISHES_ENDPOINT}/reservations/`;

export const getReservations = async (userId: string) => {
    const response = await get<GetWishesResponse>(
        reservationsEndpoint + userId,
        [],
    );

    return response.wishes;
};

export const deleteImage = async (key: string) => {
    await remove(`/media/${key}`, [WISHES_TAG], true);

    return { success: true };
};
