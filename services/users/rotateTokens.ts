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

if (!COGNITO_REGION || !COGNITO_CLIENT_ID || !COGNITO_CLIENT_SECRET) {
    throw new Error('One of the env variables is not set');
}

const client = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

const getCookieFromHeadersOrNull = (headers: string, cookieName: string) => {
    const arr = headers.split('; ');

    console.log('Array of cookies values: ', arr);

    const cookie = arr.find(cookie => cookie.includes(cookieName + '='));

    console.log('Found cookie: ', cookie);

    if (!cookie) {
        return null;
    }

    const value = cookie.split('=')[1]!;

    return decodeURIComponent(value).replace(';SameSite', '');
};

export const handler = async (event: APIGatewayProxyEvent) => {
    const cookieString = event.headers['Cookie'];

    console.log('Event: ', event);

    if (!cookieString) {
        const err = getErrorResponse(400, 'No cookies found.');
        return {
            ...err,
            headers: {
                ...err.headers,
                'Access-Control-Allow-Credentials': true,
            },
        };
    }

    const refreshToken = getCookieFromHeadersOrNull(
        cookieString,
        'refreshToken',
    );
    const username = getCookieFromHeadersOrNull(cookieString, 'username');

    if (!refreshToken || !username) {
        console.log(
            'No refresh token or username found. Results: ',
            refreshToken,
            username,
        );

        const err = getErrorResponse(
            400,
            'No refresh token or username found.',
        );

        return {
            ...err,
            headers: {
                ...err.headers,
                'Access-Control-Allow-Credentials': true,
            },
        };
    }

    console.log('Executing command with values: ', refreshToken, username);

    const initAuthCommand = new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: getSecretHash(
                username,
                COGNITO_CLIENT_SECRET,
                COGNITO_CLIENT_ID,
            ),
        },
    });

    try {
        const response = await client.send(initAuthCommand);
        const statusCode = response.$metadata.httpStatusCode;
        const authResult = response.AuthenticationResult;

        console.log('Response: ', response);

        if (!authResult || !authResult.AccessToken) {
            const err = getErrorResponse(
                401,
                'Authentication failed. No tokens present.',
            );
            return {
                ...err,
                headers: {
                    ...err.headers,
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }

        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
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
            const err = getErrorResponse(
                code,
                'User not confirmed. Please try again.',
            );
            return {
                ...err,
                headers: {
                    ...err.headers,
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }

        if (error instanceof UserNotFoundException) {
            const err = getErrorResponse(
                code,
                'User not found. Please try again.',
            );
            return {
                ...err,
                headers: {
                    ...err.headers,
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }

        return getErrorResponse(
            500,
            'Internal server error. Please contact support.',
        );
    }
};
