import { Errors, Inputs } from '@/shared/types/Auth';

const isBlank = (input: string) => input.length === 0;

const isValidEmail = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input);

    return isValid;
};

export const validate = (inputs: Required<Inputs>) => {
    const { email, password, passwordRepeat } = inputs;
    const errors: Required<Errors> = {
        email: {
            isError: false,
            messages: [],
        },
        password: {
            isError: false,
            messages: [],
        },
        passwordRepeat: {
            isError: false,
            messages: [],
        },
    };

    if (isBlank(email)) {
        errors.email.isError = true;
        errors.email.messages.push('Email cannot be blank');
    }

    if (email && !isValidEmail(email)) {
        errors.email.isError = true;
        errors.email.messages.push('Email is not valid');
    }

    if (isBlank(password)) {
        errors.password.isError = true;
        errors.password.messages.push('Password cannot be blank');
    }

    if (password && password.length < 5) {
        errors.password.isError = true;
        errors.password.messages.push(
            'Password cannot be less then 5 characters',
        );
    }

    if (isBlank(passwordRepeat) || passwordRepeat !== password) {
        errors.passwordRepeat.isError = true;
        errors.passwordRepeat.messages.push('Password is not the same');
    }

    return errors;
};
