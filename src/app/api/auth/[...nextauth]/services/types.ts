import { User } from '@/shared/types/User';

export type ExtendedToken = User & {
    tokens: Token;
    iat: number;
    exp: number;
    jti: string;
};

export interface Token {
    id: number;
    userId: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}
