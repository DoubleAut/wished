import { PlainUser } from '../User';

export interface Wish {
    id: number;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    isReserved: boolean;
    picture: string | null;
    reservedBy: PlainUser | null;
    owner: PlainUser;
    created_at: string;
    updated_at: string;
}
