'use client';

export const getAuthorizedHeaders = () => {
    const headers = new Headers();
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
};

export const appendHeadersWithJsonContentType = (headers: Headers) => {
    headers.set('Content-Type', 'application/json');

    return headers;
};
