import { Errors, Inputs } from '@/shared/types/Auth';

type RegisterReturn = {
    isSuccess: boolean;
    isError: boolean;
    errors: Required<Errors> | null;
};

export const createUser = async (body: Inputs): Promise<RegisterReturn> => {
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
    };
    const response = await fetch('/api/auth/register', options);

    const data: Required<Errors> = await response.json();

    if (!response.ok) {
        return { isError: true, isSuccess: false, errors: data };
    }

    return { isError: false, isSuccess: true, errors: null };
};
