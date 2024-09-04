import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Wish } from '../../shared/types/Wish';
import { getErrorResponse } from '../errors';
import { getTypesafeBodyOrNull } from '../helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);

    const body = getTypesafeBodyOrNull<Partial<Wish>>(event.body);

    if (!body) {
        return getErrorResponse(400, NO_BODY_ERROR);
    }

    const updateCommand = new PutCommand({
        TableName: WISHES_TABLE_NAME,
        Item: {
            ...body,
            ownerId: body.ownerId,
            id: body.id,
        },
    });

    try {
        await docClient.send(updateCommand);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({ message: 'Product successfully created' }),
        };
    } catch (err: unknown) {
        const error = err as { message: string };
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
