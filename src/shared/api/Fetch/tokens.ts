'use server';

import { REFRESH_TOKEN_KEY } from '@/shared/lib/constants/localStorage';
import { cookies } from 'next/headers';

export const isSessionExist = () => {
    const token = cookies().get(REFRESH_TOKEN_KEY);

    if (token) {
        return true;
    }

    return false;
};
