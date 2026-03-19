import { useState } from 'react';

export interface WishesPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const usePagination = () => {
    const [pagination, setPagination] = useState<WishesPagination>({
        limit: 9,
        page: 1,
        total: 0,
        totalPages: 0,
    });

    return {
        pagination,
        setPage: (val: number) => setPagination({ ...pagination, page: val }),
    };
};
