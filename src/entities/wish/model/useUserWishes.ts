import { usePagination } from '@/shared/hooks/usePagination';
import { Wish } from '@/shared/types/Wish';
import { useQuery } from '@tanstack/react-query';
import { getMyWishesPaginated } from '../lib';

export const useUserWishes = (userId: string) => {
    const { pagination, setPage } = usePagination();

    const {
        data: wishes,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ['userWishes', userId, pagination.page],
        queryFn: async (): Promise<Wish[]> => {
            if (!userId) {
                return [];
            }

            const result = await getMyWishesPaginated(userId, pagination.page);

            return result.items;
        },
    });

    return {
        wishes: wishes ?? [],
        pagination,
        refetch,
        setPage,
        isLoading,
    };
};
