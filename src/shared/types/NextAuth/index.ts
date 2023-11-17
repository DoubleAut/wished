import { User as CustomUser } from '../User';

declare module 'next-auth' {
    interface Session {
        user: User;
        error: string;
    }

    interface User extends Omit<CustomUser, 'password'> {
        id: number;
    }
}
