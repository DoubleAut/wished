import { post } from '@/shared/api/Fetch';
import { RegisterSchema } from '@/widgets/auth/register/lib';
import { USERS_ENDPOINT } from '../../login/lib/api';

interface RegisterResponse {
    statusCode: number;
}

export const register = async ({
    confirmPassword,
    ...data
}: RegisterSchema) => {
    const response = await post<unknown, RegisterResponse>(
        USERS_ENDPOINT + '/register',
        [],
        data,
    );

    return response;
};
