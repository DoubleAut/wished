export interface Wish {
    id: number;
    title: string;
    description: string;
    price: string;
    canBeAnon: boolean;
    isHidden: boolean;
    isReserved: boolean;
    picture?: string;
}

export interface User {
    id: number | null;
    email: string;
    name: string;
    surname: string;
    picture: string;
    isActive: boolean;
    followings: User[];
    followers: User[];
    wishes: Wish[];
    reservations: Wish[];
}

export type StrippedUser = Omit<User, 'password' | 'friends' | 'wishes'>;
