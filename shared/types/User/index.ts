import { Category } from '../Category';
import { Wish } from '../Wish';
export interface PlainUser {
    id: string;
    username: string;
    email: string | null;
    name: string | null;
    surname: string | null;
    picture: string | null;
    isActive: boolean | null;
}

export interface UserWithFriends extends PlainUser {
    followings: PlainUser[];
    followers: PlainUser[];
}

export interface UserWithWishes extends PlainUser {
    wishes: Wish[];
    reservations: Wish[];
}

export interface FullUser extends PlainUser {
    followings: PlainUser[];
    followers: PlainUser[];
    wishes: Wish[];
    reservations: Wish[];
    gifted: Wish[];
    completed: Wish[];
    categories: Category[];
}
