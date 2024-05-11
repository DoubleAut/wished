export const getError = (message: string) => {
    if (message.split(' ').includes('email')) {
        return 'email';
    }
    if (message.split(' ').includes('name')) {
        return 'name';
    }
    if (message.split(' ').includes('surname')) {
        return 'surname';
    }
    if (message.split(' ').includes('password')) {
        return 'password';
    }

    return null;
};
