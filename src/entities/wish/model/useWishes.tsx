import { useViewerStore } from '@/app/providers/ViewerProvider';
import { usePagination } from '@/shared/hooks/usePagination';
import { Wish } from '@/shared/types/Wish';
import { WishesTypes } from '@/widgets/wishes/ui/WishesTabs';
import { useQuery } from '@tanstack/react-query';
import {
    getMyArchivedPaginated,
    getMyGiftedPaginated,
    getMyReservationsPaginated,
    getMyWishesPaginated,
} from '../lib';

export const useWishes = (type: WishesTypes) => {
    const { pagination, setPage } = usePagination();
    const viewerId = useViewerStore(store => store.user?.id);

    const queryFn = async (page: number): Promise<Wish[]> => {
        if (!viewerId) {
            return [];
        }

        switch (type) {
            case 'wishes': {
                const result = await getMyWishesPaginated(viewerId, page);

                return result.items;
            }
            case 'reservations': {
                const result = await getMyReservationsPaginated(viewerId, page);

                return result.items;
            }
            case 'gifted': {
                const result = await getMyGiftedPaginated(viewerId, page);

                return result.items;
            }
            case 'archived': {
                const result = await getMyArchivedPaginated(viewerId, page);

                return result.items;
            }
        }
    };

    const {
        data: wishes,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: [type, pagination.page, viewerId],
        queryFn: () => queryFn(pagination.page),
    });

    return {
        wishes: wishes ?? [],
        pagination,
        refetch,
        setPage,
        isLoading,
    };
};
