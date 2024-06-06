import { get, remove } from '@/shared/api/Fetch';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { Wish } from '@/shared/types/Wish';

interface WishesAndReservations {
    wishes: Wish[];
    reservations: Wish[];
    gifted: Wish[];
    completed: Wish[];
}

export const getOwnWishes = async (userId: number) => {
    const response = await get<WishesAndReservations>(
        `/wishes/own/${userId}`,
        ['wishes', 'reservations'],
        true,
    );

    return response;
};

export const getUserWishes = async (userId: number) => {
    const response = await get<Wish[]>(`/wishes/${userId}`, ['wishes']);

    return response;
};

export const deleteImage = async (key: string) => {
    await remove(`/media/${key}`, [WISHES_TAG], true);

    return { success: true };
};
