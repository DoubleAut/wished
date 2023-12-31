import { REFRESH_ACCESS_TOKEN_ERROR } from '@/shared/lib/constants/Auth';
import { StrippedUser } from '@/shared/types/User';
import jwt from 'jsonwebtoken';
import { fetcher } from './fetcher';
import { ExtendedToken, Token } from './types';
import { JWT } from 'next-auth/jwt';

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

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
        expiresIn: 40,
    });

    return {
        accessToken,
        refreshToken,
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

// Get current tokens if exist from DB, else null
export const getUserTokens = async (userId: number) => {
    const response = await fetcher.get(`/tokens?userId=${userId}`);

    if (response.status !== 200) {
        return null;
    }

    return response.data[0] as Token | undefined;
};

export const refreshAccessToken = async (
    user: StrippedUser,
    token: Required<JWT>,
) => {
    const isRefreshValid = validateRefreshToken(token.tokens.refreshToken);

    // Refresh token expired. Return error message to redirect to login page;
    if (!isRefreshValid) {
        await removeTokens(token.tokens.id);

        return {
            ...token,
            error: REFRESH_ACCESS_TOKEN_ERROR,
        };
    }

    // Try to update existing tokens with new ones... Otherwise return same error as above!
    try {
        const newTokens = generateTokens(user);
        const response = await fetcher.put(`/tokens/${token.tokens.id}`, {
            userId: token.id,
            ...newTokens,
        });

        if (response.status !== 200) {
            throw new Error('Error occured while refreshing JWT access token');
        }

        const result = {
            ...token,
            tokens: {
                ...token.tokens,
                ...newTokens,
            },
            error: '',
        };

        return result;
    } catch (e) {
        return {
            ...token,
            error: REFRESH_ACCESS_TOKEN_ERROR,
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
export const saveTokens = async (
    user: StrippedUser,
    tokens: { accessToken: string; refreshToken: string },
) => {
    const tokenCreation = await fetcher.post('/tokens', {
        ...tokens,
        userId: user.id,
    });

    if (tokenCreation.status !== 201) {
        throw new Error('Error occured while creating a token!');
    }

    return tokenCreation.data;
};
