import {
    AdminGetUserCommand,
    CognitoIdentityProviderClient,
    ForbiddenException,
    UserNotConfirmedException,
    UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../errors';
import { GetUserDataPayload, getUserData } from './helpers';

const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (!COGNITO_REGION || !COGNITO_USER_POOL_ID) {
    throw new Error('COGNITO_REGION and COGNITO_USER_POOL_ID must be set');
}

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Getting user...');

    const username = event.pathParameters?.username as string;

    if (!username) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Username not provided',
            }),
        };
    }

    try {
        const client = new CognitoIdentityProviderClient({
            region: COGNITO_REGION,
        });

        const command = new AdminGetUserCommand({
            Username: username,
            UserPoolId: COGNITO_USER_POOL_ID,
        });

        const result = await client.send(command);

        const user = getUserData(result as GetUserDataPayload);

        console.log('Command executed. Result: ', result);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'User successfully retrieved',
                user,
            }),
        };
    } catch (error) {
        console.log('Command execution failed. Error: ', error);

        if (error instanceof ForbiddenException) {
            return getErrorResponse(403, 'Access token is invalid');
        }
        if (error instanceof UserNotConfirmedException) {
            return getErrorResponse(400, 'User not confirmed');
        }
        if (error instanceof UserNotFoundException) {
            return getErrorResponse(404, 'User not found');
        }

        return getErrorResponse(500, 'Unknown error. Please contact support');
    }
};
