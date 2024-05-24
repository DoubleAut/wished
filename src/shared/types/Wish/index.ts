import { User } from '../User';

export interface Wish {
    id: number;
    title: string;
    description: string;
    price: number;
    canBeAnon: boolean;
    isHidden: boolean;
    isReserved: boolean;
    picture: string | null;
    reservedBy: User | null;
    owner: User;
    created_at: string;
    updated_at: string;
}
