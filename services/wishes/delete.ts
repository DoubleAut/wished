import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);

    const id = event.pathParameters?.id;

    const deleteCommand = new DeleteCommand({
        TableName: WISHES_TABLE_NAME,
        Key: { id },
    });

    try {
        await docClient.send(deleteCommand);

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ message: 'Wish successfully removed' }),
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
