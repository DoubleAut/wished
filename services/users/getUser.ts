import {
    CognitoIdentityProviderClient,
    ForbiddenException,
    GetUserCommand,
    UserNotConfirmedException,
    UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../errors';
import { GetUserDataPayload, getUserData } from './helpers';

const COGNITO_REGION = process.env.COGNITO_REGION;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Getting user...');

    const accessToken = event.headers['Authorization'] as string;

    console.log('Access token: ', accessToken);

    const splitted = accessToken.split(' ') as [string, string];

    const [_key, value] = splitted;

    console.log('Value: ', value);

    try {
        const client = new CognitoIdentityProviderClient({
            region: COGNITO_REGION,
        });

        const command = new GetUserCommand({
            AccessToken: value,
        });

        const result = await client.send(command);

        const userData = getUserData(result as GetUserDataPayload);

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
            body: JSON.stringify(userData),
        };
    } catch (error) {
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
