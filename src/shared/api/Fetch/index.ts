import { logout } from '@/features/auth/logout/lib';
import { API_URL } from '@/shared/lib/constants/Config';
import { redirect } from 'next/navigation';

function wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export const rotateTokens = async () => {
    const response = (await handleUnauthorized()) as { id: number };

    return response;
};

const handleUnauthorized = async () => {
    const response = await fetch(API_URL + '/auth/refresh', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
    });

    if (!response.ok) {
        logout();

        redirect('/auth/login');
    }

    return response.json();
};

export const post = async <B, R>(
    url: string,
    data: B,
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<R> => {
    const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        credentials: withBearer ? 'include' : 'omit',
        body: JSON.stringify(data),
    });

    if (response.status === 401 && retriesLeft !== 0) {
        await handleUnauthorized();

        return await post<B, R>(url, data, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() => post(url, data, withBearer, --retriesLeft));
    }

    if (!response.ok && retriesLeft === 0) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};

export const patch = async <B, R>(
    url: string,
    data?: B,
    withBearer: boolean = false,
    retriesLeft: number = 3,
): Promise<R> => {
    const body = JSON.stringify(data);

    const response = await fetch(API_URL + url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        credentials: withBearer ? 'include' : 'omit',
        body,
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await patch(url, data, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() => patch(url, data, withBearer, --retriesLeft));
    }

    if (!response.ok && retriesLeft === 0) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};

export const remove = async <T>(
    url: string,
    withBearer: boolean = false,
    retriesLeft = 3,
): Promise<T> => {
    const response = await fetch(API_URL + url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        credentials: withBearer ? 'include' : 'omit',
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await remove<T>(url, withBearer, --retriesLeft);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() => remove(url, withBearer, --retriesLeft));
    }

    if (!response.ok) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as T;

    return result;
};

export const get = async <R>(
    url: string,
    retriesLeft: number = 3,
): Promise<R> => {
    const response = await fetch(API_URL + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    });

    if (response.status === 401 && retriesLeft > 0) {
        await handleUnauthorized();

        return await get(url);
    }

    if (!response.ok && response.status > 500 && retriesLeft > 0) {
        await wait(300).then(() => get(url, --retriesLeft));
    }

    if (!response.ok) {
        throw new Error(`Error occured while retrieving url: ${url}`);
    }

    const result = (await response.json()) as R;

    return result;
};
