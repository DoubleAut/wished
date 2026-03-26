import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    InitiateAuthCommandOutput,
    UserNotConfirmedException,
    UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getSecretHash } from '../../shared/helpers';
import { getErrorResponse } from '../errors';

export interface AuthenticateUserSchema {
    email: string;
    username: string;
    password: string;
}

const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (
    !COGNITO_REGION ||
    !COGNITO_CLIENT_ID ||
    !COGNITO_CLIENT_SECRET ||
    !COGNITO_USER_POOL_ID
) {
    throw new Error('One of the env variables is not set');
}

const client = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

export const handler = async (event: APIGatewayProxyEvent) => {
    if (!event.body) {
        return getErrorResponse(
            400,
            'No body provided. Please provide a valid body.',
        );
    }

    const body = JSON.parse(event.body) as AuthenticateUserSchema;

    if (!body.email || !body.username || !body.password) {
        return getErrorResponse(
            400,
            'No credentials provided. Please provide a valid body.',
        );
    }

    const initAuthCommand = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: body.username,
            PASSWORD: body.password,
            SECRET_HASH: getSecretHash(
                body.username,
                COGNITO_CLIENT_SECRET,
                COGNITO_CLIENT_ID,
            ),
        },
    });

    try {
        const response = await client.send(initAuthCommand);
        const statusCode = response.$metadata.httpStatusCode;
        const authResult = response.AuthenticationResult;

        if (
            !authResult ||
            !authResult.AccessToken ||
            !authResult.RefreshToken
        ) {
            return getErrorResponse(
                401,
                'Authentication failed. No tokens present.',
            );
        }

        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
                'Set-Cookie': `refreshToken=${authResult.RefreshToken};SameSite=Lax;Secure;HttpOnly;`,
            },
            body: JSON.stringify({
                accessToken: authResult.AccessToken,
            }),
        };
    } catch (error) {
        console.log('Command failed. Error: ', error);

        const err = error as InitiateAuthCommandOutput;

        const code = err.$metadata.httpStatusCode || 500;

        if (error instanceof UserNotConfirmedException) {
            return getErrorResponse(
                code,
                'User not confirmed. Please try again.',
            );
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
