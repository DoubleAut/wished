import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { MISSING_FIELDS } from '../../shared/errors/messages';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    const reservedBy = event.pathParameters?.reservedBy;
    console.log('Getting reservations with provided id: ', reservedBy);

    if (!reservedBy) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: MISSING_FIELDS,
            }),
        };
    }

    const queryCommand = new QueryCommand({
        TableName: WISHES_TABLE_NAME,
        IndexName: 'reservedBy',
        KeyConditionExpression: 'reservedBy = :reservedBy',
        ExpressionAttributeValues: marshall({ ':reservedBy': reservedBy }),
    });

    try {
        const response = await docClient.send(queryCommand);

        if (!response.Items) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({
                    message: 'Wishes not found',
                }),
            };
        }

        const wishes = response.Items.map(item => unmarshall(item));

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Wishes successfully retrieved',
                wishes,
            }),
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
