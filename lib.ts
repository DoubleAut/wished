import { rotateTokens } from '@/shared/lib/axios/axiosRequest';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function logout() {
    // Destroy the session
    cookies().set('session', '', { expires: new Date(0) });
}

export async function updateTokens(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    await rotateTokens();
}
