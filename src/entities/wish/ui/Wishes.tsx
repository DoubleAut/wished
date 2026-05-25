'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { dialogStore } from '@/features/wish/model/dialogView';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import type { ReactNode } from 'react';
import { useStore } from 'zustand';
import { useWishes } from '../model/useWishes';
import { PersonalWishActions } from './PersonalActions';
import { UserWishActions } from './UserWishActions';
import { WishCard, WishCardSkeleton } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';
import { PaginatedWishes } from './WishesPaginated';

const className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

const EmptyStateIllustration = ({ type }: { type: string }) => {
    return (
        <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground/20"
            aria-hidden="true"
        >
            {type === 'wishes' && (
                <>
                    <rect
                        x="20"
                        y="15"
                        width="80"
                        height="50"
                        rx="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M60 25L60 55"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M35 40L85 40"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M40 25Q60 15 80 25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                </>
            )}
            {type === 'reservations' && (
                <>
                    <rect
                        x="25"
                        y="20"
                        width="70"
                        height="45"
                        rx="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M60 20L60 65"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M25 35L95 35"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <circle
                        cx="60"
                        cy="42"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M56 42L60 46L66 38"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </>
            )}
            {type === 'gifted' && (
                <>
                    <rect
                        x="30"
                        y="25"
                        width="60"
                        height="35"
                        rx="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M60 25L60 60"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M30 40L90 40"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M45 25Q60 15 75 25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M50 50L70 50"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </>
            )}
            {type === 'archived' && (
                <>
                    <rect
                        x="30"
                        y="20"
                        width="60"
                        height="45"
                        rx="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <rect
                        x="35"
                        y="20"
                        width="50"
                        height="8"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <path
                        d="M45 35L75 35"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M45 45L65 45"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </>
            )}
        </svg>
    );
};

const EmptyState = ({
    title,
    description,
    action,
    type,
}: EmptyStateProps & { type: string }) => (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <EmptyStateIllustration type={type} />
        <div className="flex flex-col gap-2">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                {description}
            </p>
        </div>
        {action}
    </div>
);

const WishesSkeleton = () => (
    <div className={className}>
        {Array.from({ length: 6 }).map((_, i) => (
            <WishCardSkeleton key={i} />
        ))}
    </div>
);

interface WishesListProps {
    type: 'wishes' | 'reservations' | 'gifted' | 'archived';
}

const WishesList = ({ type }: WishesListProps) => {
    const store = useStore(dialogStore);
    const viewer = useViewerStore(state => state.user);
    const isView = store.dialogMode === 'view';
    const { wishes, pagination, setPage, isLoading } = useWishes(type);

    if (isLoading) {
        return <WishesSkeleton />;
    }

    if (wishes.length === 0) {
        switch (type) {
            case 'wishes':
                return (
                    <EmptyState
                        type="wishes"
                        title="Your wishlist is waiting"
                        description="Add something you'd love to receive. A wishlist is the best way to give gift ideas to friends and family."
                    />
                );
            case 'reservations':
                return (
                    <EmptyState
                        type="reservations"
                        title="No reservations yet"
                        description="When you find a gift you want to claim from a friend's wishlist, it will show up here."
                    />
                );
            case 'gifted':
                return (
                    <EmptyState
                        type="gifted"
                        title="No gifts given yet"
                        description="Gifts you've marked as given will appear here. Every gift tells a story."
                    />
                );
            case 'archived':
                return (
                    <EmptyState
                        type="archived"
                        title="Nothing archived"
                        description="Archived wishes will show up here when you move them. Out of sight, not out of mind."
                    />
                );
        }
    }

    return (
        <div className="space-y-2">
            <div className={className}>
                {wishes.map(wish => (
                    <WishDialog
                        key={wish.id}
                        wish={wish}
                        trigger={<WishCard wish={wish} />}
                        content={
                            isView ? (
                                <WishContent
                                    wish={wish}
                                    actions={
                                        viewer?.id === wish.ownerId ? (
                                            <PersonalWishActions
                                                key={wish.id}
                                            />
                                        ) : (
                                            <UserWishActions key={wish.id} />
                                        )
                                    }
                                />
                            ) : (
                                <WishForm
                                    onCancel={() => {}}
                                    onSuccess={() => {}}
                                />
                            )
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};

export const Wishes = () => <WishesList type="wishes" />;
export const ReservedWishes = () => <WishesList type="reservations" />;
export const GiftedWishes = () => <WishesList type="gifted" />;
export const ArchivedWishes = () => <WishesList type="archived" />;
