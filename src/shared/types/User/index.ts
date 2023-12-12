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
    id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    picture: string;
    friends: number[];
    wishes: Wish[];
}

export type StrippedUser = Omit<User, 'password' | 'friends' | 'wishes'>;
