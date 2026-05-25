import { post } from '@/shared/api/Fetch';
import { USERS_ENDPOINT } from '@/shared/lib/constants/Config';

export interface ConfirmSchema {
    code: string;
    username: string;
}

const confirmUser = async (data: ConfirmSchema) => {
    const result = await post<{}, { message: string }>(
        `${USERS_ENDPOINT}/confirm`,
        [],
        data,
    );

    return result;
};

export const confirm = async (data: ConfirmSchema) => {
    await confirmUser(data);

    return {
        ok: true,
    };
};
