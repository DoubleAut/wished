export interface Wish {
    id: string;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    ownerId: string;
    picture: string | null;
    reservedBy: string | null;
    categoryId: number | null;
    giftDay: string | null;
    isCompleted: boolean;
}
