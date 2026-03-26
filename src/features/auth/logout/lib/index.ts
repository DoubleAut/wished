'use server';

import { REFRESH_TOKEN_KEY } from '@/shared/lib/constants/localStorage';
import { cookies } from 'next/headers';

export const logout = () => {
    const cookiesStore = cookies();

    cookiesStore.delete(REFRESH_TOKEN_KEY);
    cookiesStore.delete('username');
};
