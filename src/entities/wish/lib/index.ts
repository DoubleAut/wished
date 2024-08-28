import { WISHES_ENDPOINT } from '@/features/wish/lib/api';
import { remove } from '@/shared/api/Fetch';
import { getAuthorizedHeaders } from '@/shared/api/Fetch/headers';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { Wish } from '../../../../shared/types/Wish';

interface WishesAndReservations {
    wishes: Wish[];
    reservations: Wish[];
    gifted: Wish[];
    completed: Wish[];
}

const ownWishesEndpoit = `${WISHES_ENDPOINT}/list/`;

// TODO: Add full wishes lambda integration.
export const getOwnWishes = async (userId: number) => {
    const response = await fetch(ownWishesEndpoit + userId);
    // const response = await get<WishesAndReservations>(
    //     `/wishes/own/${userId}`,
    //     ['wishes', 'reservations'],
    //     true,
    // );

    return response.json();
};

export const getUserWishes = async (userId: string) => {
    const headers = getAuthorizedHeaders();

    const response = await fetch(`${WISHES_ENDPOINT}/list/${userId}`, {
        method: 'GET',
        headers,
        next: {
            revalidate: 60 * 60 * 24,
        },
    });

    if (!response.ok) {
        throw new Error('Endpoint responded with error');
    }

    const wishes = await response.json();

    return wishes as Wish[];
};

export const deleteImage = async (key: string) => {
    await remove(`/media/${key}`, [WISHES_TAG], true);

    return { success: true };
};
