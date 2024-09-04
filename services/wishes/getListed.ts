import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { MISSING_FIELDS } from '../../shared/errors/messages';
import { getErrorResponse } from '../errors';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);
    const ownerId = event.pathParameters?.ownerId;

    if (!ownerId) {
        return getErrorResponse(400, MISSING_FIELDS);
    }

    const queryCommand = new QueryCommand({
        TableName: WISHES_TABLE_NAME,
        IndexName: 'ownerId',
        KeyConditionExpression: 'ownerId = :ownerId',
        ExpressionAttributeValues: marshall({ ':ownerId': ownerId }),
    });

    try {
        const response = await docClient.send(queryCommand);

        if (!response.Items) {
            return getErrorResponse(404, 'Wishes not found');
        }

        const wishes = response.Items.map(item => unmarshall(item));

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify(wishes),
        };
    } catch (err: unknown) {
        const error = err as { message: string };
        return getErrorResponse(500, error.message);
    }
};
