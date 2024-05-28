import { post } from '@/shared/api/Fetch';
import { PlainUser } from '@/shared/types/User';
import { RegisterSchema } from '@/widgets/auth/register/lib';

export const register = async ({
    confirmPassword,
    ...data
}: RegisterSchema) => {
    const response = await post<
        Omit<RegisterSchema, 'confirmPassword'>,
        PlainUser
    >(`/users`, data, true);

    return response;
};
