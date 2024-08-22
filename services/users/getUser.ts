import { APIGatewayProxyEvent } from 'aws-lambda';
import { getCognitoUser } from './auth';

export const handler = async (event: APIGatewayProxyEvent) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No body provided',
            }),
        };
    }

    const body = JSON.parse(event.body) as { accessToken: string };

    if (!body.accessToken) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No access token provided',
            }),
        };
    }

    const user = await getCognitoUser(body.accessToken);

    if (!user) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Access token is invalid',
            }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(user),
    };
};
