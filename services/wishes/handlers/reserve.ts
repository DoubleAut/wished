import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Wish } from '../../../shared/types/Wish';
import { getDefaultHeaders } from './helpers';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.WISHES_TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const wishId = event.pathParameters?.id;
        const reserverId = event.requestContext?.authorizer?.claims?.sub; // User making the reservation

        if (!wishId || !reserverId) {
            return {
                statusCode: 400,
                headers: getDefaultHeaders(),
                body: JSON.stringify({
                    message: 'Missing wish ID or reserver ID',
                }),
            };
        }

        // Attempt to reserve the wish
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: wishId },
            UpdateExpression: 'SET reservedBy = :reserverId, #status = :status',
            ConditionExpression:
                'attribute_exists(id) AND reservedBy = :none AND ownerId <> :reserverId',
            ExpressionAttributeNames: {
                '#status': 'status', // Use #status for the attribute name
            },
            ExpressionAttributeValues: {
                ':reserverId': reserverId,
                ':status': 'reserved', // Set the status to 'reserved'
            },
            ReturnValues: 'ALL_NEW',
        });

        const response = await docClient.send(updateCommand);
        const updatedWish = response.Attributes as Wish;

        return {
            statusCode: 200,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ wish: updatedWish }),
        };
    } catch (error) {
        console.error('Error reserving wish:', error);
        if (
            error instanceof Error &&
            error.name === 'ConditionalCheckFailedException'
        ) {
            return {
                statusCode: 409,
                headers: getDefaultHeaders(),
                body: JSON.stringify({
                    message:
                        'Wish cannot be reserved (already reserved or owned by you)',
                }),
            };
        }
        return {
            statusCode: 500,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Failed to reserve wish' }),
        };
    }
};
