import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getMyArchivedPaginated, type WishesPagination } from '../lib';

export const useMyArchived = () => {
    const [pagination, setPagination] = useState<WishesPagination>({
        limit: 9,
        page: 1,
        total: 0,
        totalPages: 0,
    });
    const { data: wishes, refetch } = useQuery({
        queryKey: ['wishes', pagination.page],
        queryFn: async () => {
            const result = await getMyArchivedPaginated(pagination.page);

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
