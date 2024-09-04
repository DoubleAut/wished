import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../errors';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

const requiredFields = ['title', 'description', 'price', 'giftDay'] as const;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);
    const id = event.pathParameters?.id;

    const getCommand = new GetCommand({
        TableName: WISHES_TABLE_NAME,
        Key: { id },
    });

    try {
        const response = await docClient.send(getCommand);

        if (!response.Item) {
            return getErrorResponse(404, 'Wish not found');
        }

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify(response.Item),
        };
    } catch (err: unknown) {
        const error = err as { message: string };
        return getErrorResponse(
            500,
            'Internal server error. Please contact support',
        );
    }
};
