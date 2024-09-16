import { SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { USERS_ENDPOINT } from '../../login/lib/api';

export interface ConfirmSchema {
    code: string;
    username: string;
}

const confirmUser = async (data: ConfirmSchema) => {
    const response = await fetch(USERS_ENDPOINT + '/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.status === 400) {
        console.log('Response', response);

        const err = (await response.json()) as { message: string };

        console.log('Error', err);

        throw new Error(err.message);
    }

    const result = (await response.json()) as SignUpCommandOutput;

    return result;
};

export const confirm = async (data: ConfirmSchema) => {
    await confirmUser(data);

    return {
        ok: true,
    };
};
