import {
    useMyArchived,
    useMyGifted,
    useMyReservations,
    useMyWishes,
} from '@/entities/wish';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import { Button } from '@/shared/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { RiBardLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionTabsContent = motion(TabsContent);

const container = {
    closed: { opacity: 0 },
    open: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

interface Props {
    userId: string;
}

type Tabs = 'wishes' | 'reservations' | 'gifted' | 'archived';

export const WishesTabs = () => {
    const [activeTab, setActiveTab] = useState<Tabs>('wishes');
    const {
        pagination: wishesPagination,
        wishes,
        refetch: refetchWishes,
    } = useMyWishes();
    const { pagination: reservationsPagination, wishes: reservations } =
        useMyReservations();
    const { pagination: giftedPagination, wishes: gifted } = useMyGifted();
    const { pagination: archivedPagination, wishes: archived } =
        useMyArchived();
    const className = 'grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    return (
        <Tabs
            defaultValue="wishes"
            className="w-full"
            onValueChange={val => setActiveTab(val as Tabs)}
        >
            <div className="flex w-full items-center justify-between">
                <TabsList className="w-fit">
                    <TabsTrigger value="wishes">Wishes</TabsTrigger>
                    <TabsTrigger value="reservations">Reservations</TabsTrigger>
                    <TabsTrigger value="gifted">Gifted</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                <WishDialog
                    trigger={
                        <Button variant="outline">
                            <RiBardLine className="mr-3 h-4 w-4" />
                            Make a wish
                        </Button>
                    }
                    content={
                        <WishForm
                            onCancel={() => {}}
                            onSuccess={refetchWishes}
                        />
                    }
                    wish={null}
                    isButtonTrigger={true}
                    defaultMode={'edit'}
                />
            </div>
            {activeTab === 'wishes' && (
                <div className="space-y-2">
                    <MotionTabsContent
                        value="wishes"
                        className={className}
                        variants={container}
                        initial="closed"
                        animate="open"
                    >
                        <Wishes wishes={wishes} />
                    </MotionTabsContent>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={'wishesPage'} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href={'wishesPage'}>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href={'wishesPage'} isActive>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href={'wishesPage'}>
                                    3
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href={'wishesPage'} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            {activeTab === 'reservations' && (
                <MotionTabsContent
                    value="reservations"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    <ReservedWishes wishes={reservations} />
                </MotionTabsContent>
            )}
            {activeTab === 'gifted' && (
                <MotionTabsContent
                    value="gifted"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    <GiftedWishes wishes={gifted} />
                </MotionTabsContent>
            )}
            {activeTab === 'archived' && (
                <MotionTabsContent
                    value="archived"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    <ArchivedWishes wishes={archived} />
                </MotionTabsContent>
            )}
        </Tabs>
    );
};
