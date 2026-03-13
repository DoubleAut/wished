'use client';

import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { RiBardLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';

export type WishesTypes = 'wishes' | 'reservations' | 'gifted' | 'archived';

const container = {
    closed: { opacity: 0 },
    open: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const motionOptions = {
    variants: container,
    initial: 'closed',
    animate: 'open',
};

const MotionTabsContent = motion(
    ({ value, children }: { value: WishesTypes; children: ReactNode }) => (
        <TabsContent value={value} {...motionOptions}>
            {children}
        </TabsContent>
    ),
);

export const WishesTabs = () => {
    const [activeTab, setActiveTab] = useState<WishesTypes>('wishes');

    // TODO: Wishes don't appear on wishes tab, FIX IT!!!!
    // After that can proceed to friends web!

    return (
        <Tabs
            defaultValue="wishes"
            className="w-full"
            onValueChange={val => setActiveTab(val as WishesTypes)}
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
                        <WishForm onCancel={() => {}} onSuccess={() => {}} />
                    }
                    wish={null}
                    isButtonTrigger={true}
                    defaultMode={'edit'}
                />
            </div>
            {activeTab === 'wishes' && (
                <MotionTabsContent value="wishes">
                    <Wishes />
                </MotionTabsContent>
            )}
            {activeTab === 'reservations' && (
                <MotionTabsContent value="reservations">
                    <ReservedWishes />
                </MotionTabsContent>
            )}
            {activeTab === 'gifted' && (
                <MotionTabsContent value="gifted">
                    <GiftedWishes />
                </MotionTabsContent>
            )}
            {activeTab === 'archived' && (
                <MotionTabsContent value="archived">
                    <ArchivedWishes />
                </MotionTabsContent>
            )}
        </Tabs>
    );
};
