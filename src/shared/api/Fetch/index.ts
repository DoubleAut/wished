import { logout } from '@/features/auth/logout/lib';
import { API_URL } from '@/shared/lib/constants/Config';
import { redirect } from 'next/navigation';
import { getAccessToken, setAccessToken } from './accessToken';

/**
 * Small delay helper for retry backoff.
 */
function wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Try to refresh the access token using the refresh endpoint.
 * If refresh fails, perform logout and redirect to login.
 *
 * Returns the parsed body from the refresh endpoint (usually { accessToken, id }).
 */
const handleUnauthorized = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        // No access token available -> force logout + redirect
        logout();
        redirect('/auth/login');
    }

    const response = await fetch(API_URL + '/auth/refresh', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        // Refresh failed -> force logout + redirect
        logout();
        redirect('/auth/login');
    }

    const data = (await response.json()) as { accessToken: string };

    setAccessToken(data.accessToken);

    return data;
};

/**
 * Centralized request implementation that handles:
 * - Authorization header injection when requested
 * - 401 refresh flow (handleUnauthorized) and retry
 * - Automatic retries for 5xx responses with a small backoff
 * - Consistent error shaping when non-2xx responses occur
 */
const request = async <R, B = unknown>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    tags: string[],
    body?: B,
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(withBearer ? getAuthorizationHeader() : {}),
    };

    const shouldAddBody =
        body !== undefined && body !== null && method !== 'GET';

    const fetchOptions: RequestInit = {
        method,
        headers,
        next: {
            tags,
        } as any,
        credentials: withBearer ? 'include' : 'omit',
        body: shouldAddBody ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(API_URL + url, fetchOptions);

    // Handle unauthorized: try refresh and retry once (as long as retriesLeft > 0)
    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return request<R, B>(
            method,
            url,
            tags,
            body,
            withBearer,
            retriesLeft - 1,
        );
    }

    // Retry on server errors (5xx)
    if (!response.ok && response.status >= 500 && retriesLeft > 0) {
        await wait(300);
        return request<R, B>(
            method,
            url,
            tags,
            body,
            withBearer,
            retriesLeft - 1,
        );
    }

    // For other non-OK statuses, attempt to surface useful error info
    if (!response.ok) {
        let errorBody: string | object = '';
        try {
            const text = await response.text();
            // Try to parse JSON body, otherwise keep as text
            try {
                errorBody = JSON.parse(text) ?? '';
            } catch {
                errorBody = text;
            }
        } catch (e) {
            errorBody = 'Unable to read response body';
        }

        throw new Error(
            `Error occured while retrieving url: ${url}. Status: ${response.status}. Body: ${JSON.stringify(
                errorBody,
            )}`,
        );
    }

    // Success path: parse JSON body
    // Some endpoints might return empty body (204) - handle gracefully
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        // If not JSON, return text casted to R when possible
        const text = (await response.text()) as unknown as R;
        return text;
    }

    const result = (await response.json()) as R;
    return result;
};

/**
 * Public helpers that match the previous API shape, implemented on top of `request`.
 */
export const rotateTokens = async () => {
    const response = await handleUnauthorized();
    return response;
};

export const post = async <B, R>(
    url: string,
    tags: string[],
    data: B,
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<R> => {
    return request<R, B>('POST', url, tags, data, withBearer, retriesLeft);
};

export const patch = async <B, R>(
    url: string,
    tags: string[],
    data?: B,
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    return request<R, B>('PATCH', url, tags, data, withBearer, retriesLeft);
};

export const remove = async <Body>(
    url: string,
    tags: string[],
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<Body> => {
    return request<Body, undefined>(
        'DELETE',
        url,
        tags,
        undefined,
        withBearer,
        retriesLeft,
    );
};

export const get = async <R>(
    url: string,
    tags: string[],
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    return request<R, undefined>(
        'GET',
        url,
        tags,
        undefined,
        withBearer,
        retriesLeft,
    );
};
