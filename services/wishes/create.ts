import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { MISSING_FIELDS } from '../../shared/errors/messages';
import { Wish } from '../../shared/types/Wish';
import { getTypesafeBodyOrNull } from '../helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating wish with provided data: ', event.body);

    const body = getTypesafeBodyOrNull<Partial<Wish>>(event.body);

    if (!body) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: NO_BODY_ERROR,
            }),
        };
    }

    const { title, description, price, giftDay, ownerId } = body;

    if (!title || !description || !price || !giftDay) {
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

    const id = randomUUID();

    const createCommand = new PutCommand({
        TableName: WISHES_TABLE_NAME,
        Item: {
            id,
            title,
            description,
            price,
            giftDay,
            ownerId,
            canBeAnon: body.canBeAnon ?? false,
            isHidden: body.isHidden ?? false,
            picture: body.picture ?? null,
            isCompleted: false,
            reservedBy: 'None',
        },
    });

    try {
        await docClient.send(createCommand);

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'Wish successfully created',
                wish: { ...body, id },
            }),
        };
    } catch (err: unknown) {
        console.log('Command execution failed. Error: ', err);
        const error = err as { message: string };
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
