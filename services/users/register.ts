import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { getSecretHash } from '../../shared/helpers';

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
    username: string;
    password: string;
    email: string;
};

export const handler = async (event: any) => {
    console.log('User creating with', event.body);

    const credentials = JSON.parse(event.body) as Payload;

    if (!credentials.username || !credentials.password || !credentials.email) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
            },
            message: JSON.stringify({
                NO_CREDENTIALS_ERROR,
            }),
        };
    }

    const signUpCommand = new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: credentials.username,
        Password: credentials.password,
        SecretHash: getSecretHash(
            credentials.username,
            COGNITO_CLIENT_SECRET,
            COGNITO_CLIENT_ID,
        ),
        UserAttributes: [
            {
                Name: 'email',
                Value: credentials.email,
            },
        ],
    });

    try {
        console.log('Signing up...', signUpCommand);

        const result = await client.send(signUpCommand);

        console.log('Command executed. Result: ', result);

        return {
            statusCode: result.$metadata.httpStatusCode,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Sign up successful',
            }),
        };
    } catch (error) {
        const err = error as SignUpCommandOutput;
        console.log('Command failed. Error: ', error);

        return {
            statusCode: err.$metadata.httpStatusCode,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Sign up failed',
            }),
        };
    }
};
