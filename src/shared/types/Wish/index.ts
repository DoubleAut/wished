export interface Wish {
    id: number;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    isReserved: boolean;
    picture?: string;
    owner: string;
}