import { Wish } from '@/shared/types/Wish';
import { WishesTypes } from '@/widgets/wishes/ui/WishesTabs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    getMyArchivedPaginated,
    getMyGiftedPaginated,
    getMyReservationsPaginated,
    getMyWishesPaginated,
    WishesPagination,
} from '../lib';

const queryFunctions: Record<WishesTypes, (page: number) => Promise<Wish[]>> = {
    wishes: async (page: number) => {
        const result = await getMyWishesPaginated(page);

        return result.items;
    },
    reservations: async (page: number) => {
        const result = await getMyReservationsPaginated(page);

        return result.items;
    },
    gifted: async (page: number) => {
        const result = await getMyGiftedPaginated(page);

        return result.items;
    },
    archived: async (page: number) => {
        const result = await getMyArchivedPaginated(page);

        return result.items;
    },
};

export const useWishes = (type: WishesTypes) => {
    const [pagination, setPagination] = useState<WishesPagination>({
        limit: 9,
        page: 1,
        total: 0,
        totalPages: 0,
    });
    const { data: wishes, refetch } = useQuery({
        queryKey: [type, pagination.page],
        queryFn: async () => {
            return queryFunctions[type](pagination.page);
        },
    });

    return {
        pagination,
        wishes: wishes ?? [],
        refetch,
        setPage: (val: number) => setPagination({ ...pagination, page: val }),
    };
};
