import { WishesPagination } from '@/shared/hooks/usePagination';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';

interface PaginatedWishesProps {
    pagination: WishesPagination;
    onPageChange: (val: number) => void;
}

const getPageNumbers = (
    current: number,
    total: number,
): (number | 'ellipsis')[] => {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    pages.push(1);

    if (current > 3) {
        pages.push('ellipsis');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push('ellipsis');
    }

    if (total > 1) {
        pages.push(total);
    }

    return pages;
};

export const PaginatedWishes = ({
    pagination,
    onPageChange,
}: PaginatedWishesProps) => {
    if (pagination.totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);

    return (
        <Pagination>
            <PaginationContent>
                {pagination.page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(pagination.page - 1)}
                        />
                    </PaginationItem>
                )}
                {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === pagination.page}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}
                {pagination.page < pagination.totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(pagination.page + 1)}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};
