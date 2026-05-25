import { APIGatewayProxyEvent } from 'aws-lambda';

export const getDefaultHeaders = () => ({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
});

export const getRequestingUserId = (
    event: APIGatewayProxyEvent,
): string | undefined => {
    const authorizer = event.requestContext?.authorizer;
    if (authorizer?.principalId) {
        return authorizer.principalId;
    }

    return event.queryStringParameters?.userId;
};
