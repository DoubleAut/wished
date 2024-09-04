import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { MISSING_FIELDS } from '../../shared/errors/messages';
import { Wish } from '../../shared/types/Wish';
import { getErrorResponse } from '../errors';
import { getTypesafeBodyOrNull } from '../helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

const requiredFields = ['title', 'description', 'price', 'giftDay'] as const;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Creating product with provided data: ', event.body);

    const body = getTypesafeBodyOrNull<Partial<Wish>>(event.body);

    if (!body) {
        return getErrorResponse(400, NO_BODY_ERROR);
    }

    const { title, description, price, giftDay, ownerId } = body;

    if (!title || !description || !price || !giftDay) {
        const missing = requiredFields.filter(key => !body[key]);

        return getErrorResponse(400, MISSING_FIELDS);
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
            reservedBy: null,
        },
    });

    try {
        await docClient.send(createCommand);

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({
                message: 'Wish successfully created',
                wish: { ...body, id },
            }),
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
