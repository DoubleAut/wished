import { Errors, Inputs } from '../../types/Auth';

const isBlank = (input: string) => input.length === 0;

const isValidEmail = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input);

    return isValid;
};

export const validateEmail = (email: Inputs['email']) => {
    const errors: Errors['email'] = {
        isError: false,
        messages: [],
    };

    if (isBlank(email)) {
        errors.isError = true;
        errors.messages.push('Email cannot be blank');
    }

    if (email && !isValidEmail(email)) {
        errors.isError = true;
        errors.messages.push('Email address is wrong');
    }

    return errors;
};

export const validatePassword = (password: Inputs['password']) => {
    const errors: Errors['password'] = {
        isError: false,
        messages: [],
    };

    if (isBlank(password)) {
        errors.isError = true;
        errors.messages.push('Password cannot be blank');
    }

    if (password && password.length < 5) {
        errors.isError = true;
        errors.messages.push('Password cannot be less then 5 characters');
    }

    return errors;
};
