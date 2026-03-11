import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getMyWishesPaginated, type WishesPagination } from '../lib';

export type WishType = 'wishes' | 'reservations' | 'gifted' | 'archived';

const initialPage = {};

export const useMyWishes = () => {
    const [pagination, setPagination] = useState<WishesPagination>({
        limit: 9,
        page: 1,
        total: 0,
        totalPages: 0,
    });
    const { data: wishes, refetch } = useQuery({
        queryKey: ['wishes', pagination.page],
        queryFn: async () => {
            const result = await getMyWishesPaginated(pagination.page);

            return result.items;
        },
    });

    return {
        pagination,
        wishes: wishes ?? [],
        refetch,
        setPage: (val: number) => setPagination({ ...pagination, page: val }),
    };
};
