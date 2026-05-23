import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';

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
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({
                    message: 'Wish not found',
                }),
            };
        }

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify(response.Item),
        };
    } catch (err: unknown) {
        const error = err as { message: string };
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
