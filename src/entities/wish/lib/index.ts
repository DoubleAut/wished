import { get } from '@/shared/api/Fetch';
import { Wish } from '@/shared/types/Wish';

interface WishesAndReservations {
    wishes: Wish[];
    reservations: Wish[];
}

export const getWishesAndReservations = async (userId: number) => {
    const response = await get<WishesAndReservations>(`/wishes/${userId}`);

    return response;
};
