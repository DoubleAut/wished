import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../errors';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);

    const id = event.pathParameters?.wishId;

    const deleteCommand = new DeleteCommand({
        TableName: WISHES_TABLE_NAME,
        Key: { id },
    });

    try {
        await docClient.send(deleteCommand);

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({ message: 'Wish successfully removed' }),
        };
    } catch (err: unknown) {
        const error = err as { message: string };
        return getErrorResponse(
            500,
            'Internal server error. Please contact support',
        );
    }
};
