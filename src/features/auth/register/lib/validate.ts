import {
    validateEmail,
    validatePassword,
} from '@/shared/lib/utils/authValidation';
import { Errors, Inputs } from '@/shared/types/Auth';

export const validate = (inputs: Required<Inputs>) => {
    const { email, password, passwordRepeat } = inputs;
    const errors: Errors['passwordRepeat'] = {
        isError: false,
        messages: [],
    };

    if (passwordRepeat !== password) {
        errors.isError = true;
        errors.messages.push('Password is not the same');
    }

    return {
        email: validateEmail(email),
        password: validatePassword(password),
        passwordRepeat: errors,
    };
};
