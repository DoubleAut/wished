'use client';

import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import {
    RiAddLine,
    RiArchiveLine,
    RiGiftLine,
    RiHandbagLine,
    RiStarLine,
} from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';
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

const tabVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

const tabContent: Record<WishesTypes, ReactNode> = {
    wishes: <Wishes />,
    reservations: <ReservedWishes />,
    gifted: <GiftedWishes />,
    archived: <ArchivedWishes />,
};

export const WishesTabs = () => {
    const [activeTab, setActiveTab] = useState<WishesTypes>('wishes');

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Segmented tab bar + Add wish button */}
            <div className="flex flex-row items-center justify-between gap-3">
                <div className="bg-muted/50 flex flex-1 rounded-xl p-1 sm:flex-initial">
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`
                                relative flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                                ${
                                    activeTab === tab.value
                                        ? 'bg-card text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
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

            {/* Animated tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                        duration: 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {tabContent[activeTab]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
