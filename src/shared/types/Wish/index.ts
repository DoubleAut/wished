export interface Wish {
    id: number;
    title: string;
    description: string;
    price: string;
    canBeAnon: string;
    isHidden: boolean;
    isReserved: boolean;
    picture?: string;
    owner: string;
}
