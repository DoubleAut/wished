import { post } from '@/shared/api/Fetch';
import { USERS_ENDPOINT } from '@/shared/lib/constants/Config';
import { RegisterSchema } from '@/widgets/auth/register/lib';

interface RegisterResponse {
    statusCode: number;
}

export const register = async ({
    confirmPassword,
    ...data
}: RegisterSchema) => {
    const response = await post<unknown, RegisterResponse>(
        `${USERS_ENDPOINT}/register`,
        [],
        data,
    );

    return response;
};
