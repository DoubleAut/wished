import { User as CustomUser } from '../User';

declare module 'next-auth' {
    interface Session {
        user: User;
        error: string;
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
