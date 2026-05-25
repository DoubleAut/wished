'use client';

import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
    RiAddLine,
    RiArchiveLine,
    RiGiftLine,
    RiHandbagLine,
    RiStarLine,
} from '@remixicon/react';
import { useState, type ReactNode } from 'react';

export type WishesTypes = 'wishes' | 'reservations' | 'gifted' | 'archived';

interface TabConfig {
    value: WishesTypes;
    label: string;
    icon: ReactNode;
    description: string;
}

const tabs: TabConfig[] = [
    {
        value: 'wishes',
        label: 'Wishes',
        icon: <RiStarLine className="h-4 w-4" />,
        description: 'Your active wishlist',
    },
    {
        value: 'reservations',
        label: 'Reserved',
        icon: <RiHandbagLine className="h-4 w-4" />,
        description: 'Gifts you have claimed',
    },
    {
        value: 'gifted',
        label: 'Gifted',
        icon: <RiGiftLine className="h-4 w-4" />,
        description: 'Gifts you have given',
    },
    {
        value: 'archived',
        label: 'Archived',
        icon: <RiArchiveLine className="h-4 w-4" />,
        description: 'Past wishes',
    },
];

export const WishesTabs = () => {
    const [activeTab, setActiveTab] = useState<WishesTypes>('wishes');

    return (
        <Tabs
            defaultValue="wishes"
            className="flex w-full flex-col gap-4"
            onValueChange={val => setActiveTab(val as WishesTypes)}
        >
            <div className="flex flex-row items-center justify-between">
                <TabsList className="w-full sm:w-auto" variant="line">
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex items-center gap-1.5 whitespace-nowrap"
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <WishDialog
                    trigger={
                        <>
                            <RiAddLine className="h-4 w-4" />
                            Add a wish
                        </>
                    }
                    content={
                        <WishForm onCancel={() => {}} onSuccess={() => {}} />
                    }
                    wish={null}
                    isButtonTrigger={true}
                    defaultMode={'edit'}
                />
            </div>
            <TabsContent value="wishes">
                <Wishes />
            </TabsContent>
            <TabsContent value="reservations">
                <ReservedWishes />
            </TabsContent>
            <TabsContent value="gifted">
                <GiftedWishes />
            </TabsContent>
            <TabsContent value="archived">
                <ArchivedWishes />
            </TabsContent>
        </Tabs>
    );
};
