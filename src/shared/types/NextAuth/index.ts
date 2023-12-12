import { User as CustomUser } from '../User';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        error: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }
    interface User extends Omit<CustomUser, 'password' | 'wishes' | 'friends'> {
        id: string;
        tokens: {
            id: number;
            userId: number;
            tokenId: number;
            accessToken: string;
            refreshToken: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        sub: string;
        name: string;
        surname?: string;
        email: string;
        picture: string;
        tokens?: {
            id: number;
            userId: number;
            tokenId: number;
            accessToken: string;
            refreshToken: string;
        };
        iat?: number;
        exp?: number;
        jti?: string;
        error: string;
    }
}
