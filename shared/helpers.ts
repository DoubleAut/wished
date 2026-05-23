import { createHmac } from 'crypto';

export const getSecretHash = (
    username: string,
    clientSecret: string,
    clientId: string,
) => {
    const hash = createHmac('sha256', clientSecret);

    hash.update(`${username}${clientId}`);

    const rawHash = hash.digest();

    return rawHash.toString('base64');
};
