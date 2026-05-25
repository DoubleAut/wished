'use client';

import { DialogMode, dialogStore } from '@/features/wish/model/dialogView';
import { DeleteWish, EditWish } from '@/features/wish/ui/Actions';
import { cn } from '@/shared/lib/classNames/cn';
import { Wish } from '@/shared/types/Wish';
import { Button } from '@/shared/ui/button';
import { RiArrowLeftSLine } from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { useStore } from 'zustand';

interface Props {
    content: ReactNode;
    trigger: ReactNode;
    className?: string;
    wish: Partial<Wish> | null;
    isButtonTrigger?: boolean;
    defaultMode?: DialogMode;
}

/**
 * WishDialog is a slide-in panel (desktop) / bottom sheet (mobile) that opens on trigger click.
 * Replaces the old modal pattern with a more natural browsing experience.
 */

export const WishDialog = ({
    wish,
    trigger,
    content,
    isButtonTrigger = false,
    defaultMode = 'view',
}: Props) => {
    const store = useStore(dialogStore);
    const isStoreWishIsTheSame = store.dialogWish?.id === wish?.id;
    const isOpen = store.isOpen && isStoreWishIsTheSame;
    const setOpen = store.setOpen;
    const setDialogWish = store.setDialogWish;

    const onOpenChange = (value: boolean) => {
        if (value) {
            setDialogWish(wish, defaultMode);
        }

        setOpen(value);
    };

    // Lock body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.documentElement.classList.add('overflow-hidden');
        } else {
            document.documentElement.classList.remove('overflow-hidden');
        }

        return () => {
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    return (
        <>
            {/* Trigger */}
            {isButtonTrigger ? (
                <Button
                    variant="default"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2 rounded-lg shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                    onClick={() => onOpenChange(true)}
                >
                    {trigger}
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    className="focus-visible:ring-ring h-auto w-auto cursor-pointer p-0 focus-visible:ring-2"
                    onClick={() => onOpenChange(true)}
                >
                    {trigger}
                </Button>
            )}

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={cn(
                            'bg-card ring-accent/20 fixed inset-y-0 right-0 z-50 flex w-full flex-col shadow-xl ring-1',
                            'sm:max-w-lg sm:rounded-l-2xl',
                            'md:max-w-xl',
                        )}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            duration: 0.25,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    >
                        {/* Header */}
                        <div className="border-border/50 flex items-center justify-between border-b px-4 py-3 sm:px-6">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <RiArrowLeftSLine className="h-5 w-5" />
                                </Button>
                                <span className="text-foreground text-sm font-semibold">
                                    {store.dialogMode === 'edit'
                                        ? store.dialogWish?.id
                                            ? 'Edit wish'
                                            : 'New wish'
                                        : 'Wish details'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {store.dialogMode === 'view' && (
                                    <>
                                        <EditWish onAction={() => {}} />
                                        <DeleteWish onAction={() => {}} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">{content}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
