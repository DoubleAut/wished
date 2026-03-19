import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';
import { WishesPagination } from '../lib';

export const PaginatedWishes = ({
    pagination,
}: {
    pagination: WishesPagination;
    onPageChange: (val: number) => void;
}) => {
    return (
        <Pagination>
            <PaginationContent>
                {pagination.page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious />
                    </PaginationItem>
                )}
                {pagination.page > 1 && (
                    <PaginationItem>
                        <PaginationLink>1</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationLink isActive>{pagination.page}</PaginationLink>
                </PaginationItem>
                {pagination.page + 1 <= pagination.totalPages && (
                    <PaginationItem>
                        <PaginationLink href={'wishesPage'}>
                            {pagination.page + 1}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {pagination.totalPages > 1 && (
                    <PaginationItem>
                        <PaginationNext href={'wishesPage'} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};
