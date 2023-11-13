import {
    validateEmail,
    validatePassword,
} from '@/shared/lib/utils/authValidation';
import { Inputs } from '@/shared/types/Auth';

export const validate = (inputs: Inputs) => {
    const { email, password } = inputs;

    return {
        email: validateEmail(email),
        password: validatePassword(password),
    };
};
