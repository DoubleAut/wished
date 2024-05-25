import { rotateTokens } from '@/shared/lib/axios/axiosRequest';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    return await rotateTokens();
}
