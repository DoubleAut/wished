'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { dialogStore } from '@/features/wish/model/dialogView';
import {
    CompleteWish,
    DeleteWish,
    EditWish,
    HideWish,
    ReserveWish,
} from '@/features/wish/ui/Actions';
import { WishContent } from '@/widgets/wishes/ui/WishContent';
import { useStore } from 'zustand';
import { useWishes } from '../model/useWishes';
import { WishCard } from './WishCard';
import { WishDialog } from './WishDialog';
import { WishForm } from './WishForm';
import { PaginatedWishes } from './WishesPaginated';

export const PersonalWishActions = () => {
    const onAction = () => {};

    return (
        <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <CompleteWish onAction={onAction} />
            <EditWish onAction={onAction} />
            <HideWish onAction={onAction} />
            <DeleteWish onAction={onAction} />
        </div>
    );
};

export const UserWishActions = () => (
    <div className="flex flex-col gap-2 sm:flex-row">
        <ReserveWish onAction={() => {}} />
    </div>
);

const className = 'grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

// const WishesContainer = ({
//     pagination,
//     children,
// }: {
//     children: ReactNode;
//     pagination: WishesPagination;
// }) => (
//     <div>
//         <div className={className}>{children}</div>
//         <PaginatedWishes pagination={pagination} />
//     </div>
// );

export const Wishes = () => {
    const store = useStore(dialogStore);
    const viewer = useViewerStore(state => state.user);
    const isView = store.dialogMode === 'view';
    const { wishes, pagination, setPage } = useWishes('wishes');

    return (
        <div>
            <div className={className}>
                {wishes.map(wish => (
                    <WishDialog
                        wish={wish}
                        key={wish.id + wish.title}
                        trigger={<WishCard wish={wish} />}
                        content={
                            isView ? (
                                <WishContent
                                    wish={wish}
                                    actions={
                                        viewer?.id === wish.owner.id ? (
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

export const ReservedWishes = () => {
    const { wishes, pagination, setPage } = useWishes('reservations');

    return (
        <div>
            <div className={className}>
                {wishes.map(wish => (
                    <WishDialog
                        wish={wish}
                        key={wish.id + wish.title}
                        trigger={<WishCard wish={wish} />}
                        content={
                            <WishContent
                                wish={wish}
                                actions={<UserWishActions key={wish.id} />}
                            />
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};

export const GiftedWishes = () => {
    const { wishes, pagination, setPage } = useWishes('gifted');

    return (
        <div>
            <div className={className}>
                {wishes.map(wish => (
                    <WishDialog
                        wish={wish}
                        key={wish.id + wish.title}
                        trigger={<WishCard wish={wish} />}
                        content={
                            <WishContent
                                wish={wish}
                                actions={<UserWishActions key={wish.id} />}
                            />
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};

export const ArchivedWishes = () => {
    const { wishes, pagination, setPage } = useWishes('archived');

    return (
        <div>
            <div className={className}>
                {wishes.map(wish => (
                    <WishDialog
                        wish={wish}
                        key={wish.id + wish.title}
                        trigger={<WishCard wish={wish} />}
                        content={
                            <WishContent
                                wish={wish}
                                actions={<UserWishActions key={wish.id} />}
                            />
                        }
                    />
                ))}
            </div>
            <PaginatedWishes pagination={pagination} onPageChange={setPage} />
        </div>
    );
};
