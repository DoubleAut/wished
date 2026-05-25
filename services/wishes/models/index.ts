export type WishStatuses = 'active' | 'reserved' | 'gifted' | 'archived';

export interface Wish {
    id: string;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    ownerId: string;
    picture: string | null;
    reservedBy: string | 'None';
    giftDay: string | null;
    categoryId: string | null;
    status: WishStatuses;
}
