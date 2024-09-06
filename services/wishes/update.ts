import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Wish } from '../../shared/types/Wish';
import { getTypesafeBodyOrNull } from '../helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Updateing wish with provided data: ', event.body);

    const id = event.pathParameters?.id;
    const body = getTypesafeBodyOrNull<Partial<Wish>>(event.body);

    if (!body || !id) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'No body or id provided',
            }),
        };
    }

    const itemKeys = Object.keys(body).filter(k => k !== id);
    const updateCommand = new UpdateCommand({
        TableName: WISHES_TABLE_NAME,
        UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
        ExpressionAttributeNames: itemKeys.reduce(
            (accumulator, k, index) => ({
                ...accumulator,
                [`#field${index}`]: k,
            }),
            {},
        ),
        ExpressionAttributeValues: itemKeys.reduce(
            (accumulator, k, index) => ({
                ...accumulator,
                [`:value${index}`]: body[k as keyof Wish],
            }),
            {},
        ),
        Key: {
            id: id,
        },
        ReturnValues: 'ALL_NEW',
    });

    try {
        const response = await docClient.send(updateCommand);

        console.log('Wish updated: ', response);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Wish successfully updated',
                wish: { ...body, id: id },
            }),
        };
    } catch (err: unknown) {
        console.log(err);
        const error = err as { message: string };
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
