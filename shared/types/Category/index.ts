import { PlainUser } from '../User';

export interface Category {
    id: number;
    name: string;
    owner: PlainUser;
}
