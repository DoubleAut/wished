import { useViewerStore } from '@/core/providers/ViewerProvider';
import { getReservations, getWishes } from '@/entities/wish/lib';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { RiBardLine } from '@remixicon/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type TabsValues = 'wishes' | 'reservations' | 'gifted' | 'archived';

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

const SkeletonPlaceholder = () => (
    <AspectRatio
        ratio={4 / 3}
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded"
    >
        <Skeleton className="h-full w-full" />
    </AspectRatio>
);

export const WishesTabs = () => {
    const [state, setState] = useState<TabsValues>('wishes');
    const viewer = useViewerStore(state => state.user);
    const setWishes = useViewerStore(state => state.setWishes);
    const setReservations = useViewerStore(state => state.setReservations);
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);
    const gifted = useViewerStore(state => state.gifted);
    const completed = useViewerStore(state => state.completed);
    const className = 'grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    const onChange = (value: string) => setState(value as TabsValues);

    const { data: ownWishes, status: ownWishesStatus } = useQuery({
        queryKey: ['wishes'],
        queryFn: () => {
            if (!viewer) {
                return [];
            }

            return getWishes(viewer.id);
        },
    });

    const { data: reservedWishes, status: reservationWishesStatus } = useQuery({
        queryKey: ['reservations'],
        queryFn: () => {
            if (!viewer) {
                return [];
            }

            return getReservations(viewer.id);
        },
    });

    useEffect(() => {
        if (ownWishesStatus === 'success' && ownWishes) {
            setWishes(ownWishes);
        }
    }, [ownWishes, ownWishesStatus]);

    useEffect(() => {
        if (reservationWishesStatus === 'success' && reservedWishes) {
            setReservations(reservedWishes);
        }
    }, [reservedWishes, reservationWishesStatus]);

    return (
        <Tabs defaultValue="wishes" className="w-full" onValueChange={onChange}>
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
                    content={<WishForm onCancel={() => {}} />}
                    wish={null}
                    isButtonTrigger={true}
                    defaultMode={'edit'}
                />
            </div>
            {state === 'wishes' && (
                <MotionTabsContent
                    value="wishes"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    {ownWishesStatus === 'pending' && (
                        <>
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                        </>
                    )}
                    <Wishes wishes={wishes} />
                </MotionTabsContent>
            )}
            {state === 'reservations' && (
                <MotionTabsContent
                    value="reservations"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    {reservationWishesStatus === 'pending' && (
                        <>
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                        </>
                    )}
                    <ReservedWishes wishes={reservations} />
                </MotionTabsContent>
            )}
            {state === 'gifted' && (
                <MotionTabsContent
                    value="gifted"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    {ownWishesStatus === 'pending' && (
                        <>
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                        </>
                    )}
                    <GiftedWishes wishes={gifted} />
                </MotionTabsContent>
            )}
            {state === 'archived' && (
                <MotionTabsContent
                    value="archived"
                    className={className}
                    variants={container}
                    initial="closed"
                    animate="open"
                >
                    {reservationWishesStatus === 'pending' && (
                        <>
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                            <SkeletonPlaceholder />
                        </>
                    )}
                    <ArchivedWishes wishes={completed} />
                </MotionTabsContent>
            )}
        </Tabs>
    );
};
