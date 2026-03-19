'use server';

import { REFRESH_TOKEN_KEY } from '@/shared/lib/constants/localStorage';
import { cookies } from 'next/headers';

export const isSessionExist = async () => {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(REFRESH_TOKEN_KEY);

    if (token) {
        return true;
    }

    return false;
};
