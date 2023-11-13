import { Errors, Inputs } from '@/shared/types/Auth';

const isBlank = (input: string) => input.length === 0;

const isValidEmail = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input);

    return isValid;
};

export const validate = (inputs: Inputs) => {
    const { email, password } = inputs;
    const errors: Errors = {
        email: {
            isError: false,
            messages: [],
        },
        password: {
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
        errors.email.messages.push('Email address is wrong');
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

    return errors;
};
