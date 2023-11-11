import { Errors, Inputs } from '@/shared/types/Auth';

type RegisterReturn = {
    isSuccess: boolean;
    isError: boolean;
    body?: {
        id: string;
        email: string;
        password: string;
    };
    errors?: Required<Errors>;
};

export const handleRegister = async (body: Inputs): Promise<RegisterReturn> => {
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
    };

    const response = await fetch('/api/auth/register', options);
    const data = await response.json();

    if (!response.ok) {
        return { isError: true, isSuccess: false, errors: data };
    }

    return { isError: false, isSuccess: true, body: data };
};
