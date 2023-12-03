interface Wish {
    title: string;
    description: string;
    price: string;
    canBeAnon: true;
    isHidden: true;
    isReserved: true;
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
