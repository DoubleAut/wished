export interface Wish {
    id: number;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    picture: string | null;
    reservedBy: string | null;
    ownerId: string;
    categoryId: number | null;
    giftDay: string | null;
    isCompleted: boolean;
    created_at: string;
    updated_at: string;
}
