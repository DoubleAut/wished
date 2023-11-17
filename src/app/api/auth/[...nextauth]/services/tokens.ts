import { StrippedUser } from '@/shared/types/User';
import jwt from 'jsonwebtoken';
import { fetcher } from './fetcher';

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

interface Tokens {
    id: number;
    userId: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}

if (!accessSecret || !refreshSecret) {
    throw new Error('There is no jwt access or secret key');
}

export const generateTokens = (credentials: StrippedUser) => {
    const { email, name, surname } = credentials;
    const dto = { email, name, surname };
    const accessToken = jwt.sign(dto, accessSecret, {
        expiresIn: 15,
    });
    const refreshToken = jwt.sign(dto, refreshSecret, {
        expiresIn: 60,
    });

    return {
        accessToken,
        refreshToken,
        accessTokenExpiresIn: Date.now() + 1000 * 15,
    };
};

// You won't believe me...
export const validateAccessToken = (token: string) => {
    try {
        const validated = jwt.verify(token, accessSecret);

        return !!validated;
    } catch (e) {
        return false;
    }
};

// You won't believe me...
export const validateRefreshToken = (token: string) => {
    try {
        const validated = jwt.verify(token, refreshSecret);

        return !!validated;
    } catch (e) {
        return false;
    }
};

type UserTokensResponse = Tokens | null;

// Get current tokens if exist from DB, else null;
export const getUserTokens = async (userId: number) => {
    const response = await fetcher.get(`/tokens?userId=${userId}`);

    if (response.status !== 200) {
        return null;
    }

    return response.data[0] as UserTokensResponse;
};

export const refreshAccessToken = async (user: StrippedUser, token: any) => {
    const isRefreshValid = validateRefreshToken(token.refreshToken);

    // Refresh token expired. Return error message to redirect to login page;
    if (!isRefreshValid) {
        console.log(
            'Refresh token expired, removing the old tokens with error',
        );

        await removeTokens(token.tokenId);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }

    // Try to update existing tokens with new ones... Otherwise return same error as above!
    try {
        const newTokens = generateTokens(user);
        const response = await fetcher.put(`/tokens/${token.tokenId}`, {
            userId: token.id,
            ...newTokens,
        });

        if (response.status !== 200) {
            throw new Error('Error occured while refreshing JWT access token');
        }

        return {
            ...token,
            ...newTokens,
        };
    } catch (e) {
        console.log(
            'Error occured while updating the access token, returning old tokens with error',
        );

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
};

// Utility function to remove tokens from DB
export const removeTokens = async (tokenId: number) => {
    const tokenCreation = await fetcher.delete(`/tokens/${tokenId}`);

    if (tokenCreation.status !== 200) {
        throw new Error('Error occured while deleting a token!');
    }

    return tokenCreation.data;
};

// Utility function to create tokens to DB
export const saveTokens = async (user: StrippedUser, tokens: any) => {
    const tokenCreation = await fetcher.post('/tokens', {
        ...tokens,
        userId: user.id,
    });

    if (tokenCreation.status !== 201) {
        throw new Error('Error occured while creating a token!');
    }

    return tokenCreation.data;
};
