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

export const getHeadersWithAuthorizationIfPresent = (
    includeToken: boolean,
): Headers => {
    const headers = new Headers();
    const accessToken = getAccessToken();

    if (includeToken) {
        headers.append('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
};
