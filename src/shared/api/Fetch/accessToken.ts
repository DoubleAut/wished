'use client';

import { ACCESS_TOKEN_KEY } from '@/shared/lib/constants/localStorage';

export const getAccessToken = (): string | null => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    return accessToken;
};

export const setAccessToken = (accessToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getAuthorizationHeader = (): { Authorization: string } | null => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return null;
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
