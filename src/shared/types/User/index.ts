import { Wish } from '../Wish';

export interface User {
    id: number;
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
