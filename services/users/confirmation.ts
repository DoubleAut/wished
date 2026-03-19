import {
    CodeMismatchException,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    ConfirmSignUpCommandOutput,
    ExpiredCodeException,
    UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { getSecretHash } from '../../shared/helpers';
import { getErrorResponse } from '../errors';

const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

if (!COGNITO_CLIENT_ID || !COGNITO_REGION || !COGNITO_CLIENT_SECRET) {
    throw new Error(
        'COGNITO_CLIENT_ID or COGNITO_REGION or COGNITO_CLIENT_SECRET is required',
    );
}

const client = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

type Payload = {
    code: string;
    username: string;
};

export const handler = async (event: any) => {
    console.log('User creating with', event.body);

    const credentials = JSON.parse(event.body) as Payload;

    const confirmSignUpCommand = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: credentials.username,
        ConfirmationCode: credentials.code,
        SecretHash: getSecretHash(
            credentials.username,
            COGNITO_CLIENT_SECRET,
            COGNITO_CLIENT_ID,
        ),
    });

    try {
        console.log('Confirming sign up...', confirmSignUpCommand);

        const result = await client.send(confirmSignUpCommand);

        console.log('Command executed. Result: ', result);

        return {
            statusCode: result.$metadata.httpStatusCode,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Successfully confirmed',
            }),
        };
    } catch (error) {
        console.log('Command failed. Error: ', error);

        const err = error as ConfirmSignUpCommandOutput;

        const code = err.$metadata.httpStatusCode || 500;

        if (error instanceof CodeMismatchException) {
            return getErrorResponse(code, 'Error sending confirmation code');
        }

        if (error instanceof ExpiredCodeException) {
            return getErrorResponse(code, 'Error sending confirmation code');
        }

        if (error instanceof UserNotFoundException) {
            return getErrorResponse(code, 'User not found. Please try again.');
        }

        return getErrorResponse(
            500,
            'Internal server error. Please contact support.',
        );
    }
};
