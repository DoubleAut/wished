import { logout } from '@/features/auth/logout/lib';
import { redirect } from 'next/navigation';
import {
    getAccessToken,
    getHeadersWithAuthorizationIfPresent,
    setAccessToken,
} from './accessToken';

function wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export const rotateTokens = async () => {
    const response = (await handleUnauthorized()) as { id: number };

    return response;
};

const logOutAndRedirect = () => {
    logout();

    redirect('/auth/login');
};

const handleUnauthorized = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        console.log('No access token');
        logOutAndRedirect();
    }

    const response = await fetch('/api/rotate', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        console.log('response is not ok');
        logOutAndRedirect();
    }

    const data = (await response.json()) as { accessToken: string; id: number };

    setAccessToken(data.accessToken);

    return data;
};

export const post = async <B, R>(
    url: string,
    tags: string[],
    data: B,
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<R> => {
    const headers = getHeadersWithAuthorizationIfPresent(withBearer);

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        next: {
            tags,
        },
        credentials: withBearer ? 'include' : 'omit',
        body: JSON.stringify(data),
    });

    if (response.status === 401 && retriesLeft !== 0) {
        await handleUnauthorized();

        return await post<B, R>(url, tags, data, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() =>
            post(url, tags, data, withBearer, --retriesLeft),
        );
    }

    if (!response.ok && retriesLeft === 0) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};

export const patch = async <B, R>(
    url: string,
    tags: string[],
    data?: B,
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    const headers = getHeadersWithAuthorizationIfPresent(withBearer);
    const body = JSON.stringify(data);

    const response = await fetch(url, {
        method: 'PATCH',
        headers: headers,
        next: {
            tags,
        },
        credentials: withBearer ? 'include' : 'omit',
        body,
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await patch(url, tags, data, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() =>
            patch(url, tags, data, withBearer, --retriesLeft),
        );
    }

    if (!response.ok && retriesLeft === 0) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};

export const remove = async <Body>(
    url: string,
    tags: string[],
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<Body> => {
    const headers = getHeadersWithAuthorizationIfPresent(withBearer);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        next: {
            tags,
        },
        credentials: withBearer ? 'include' : 'omit',
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await remove<Body>(url, tags, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() =>
            remove<Body>(url, tags, withBearer, --retriesLeft),
        );
    }

    if (!response.ok) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as Body;

    return result;
};

export const get = async <R>(
    url: string,
    tags: string[],
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    const headers = getHeadersWithAuthorizationIfPresent(withBearer);
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await get(url, tags);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() => get(url, tags, withBearer, --retriesLeft));
    }

    if (!response.ok) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};
