import { WishesPagination } from '@/shared/hooks/usePagination';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';

interface PaginatedWishesProps {
    pagination: WishesPagination;
    onPageChange: (val: number) => void;
}

export const PaginatedWishes = ({
    pagination,
    onPageChange,
}: PaginatedWishesProps) => {
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
                {pagination.page > 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationLink isActive>{pagination.page}</PaginationLink>
                </PaginationItem>
                {pagination.page + 1 <= pagination.totalPages && (
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(pagination.page + 1)}
                        >
                            {pagination.page + 1}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {pagination.totalPages > 1 && (
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
