import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getDefaultHeaders } from '../../helpers';

const dynamoClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client();

const WISHES_TABLE_NAME = process.env.WISHES_TABLE_NAME || '';
const UPLOAD_BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Deleting wish: ', event.body);

    const id = event.pathParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Missing wish id' }),
        };
    }

    try {
        // Get the wish first to extract picture URL for cascade delete
        const getCommand = new GetCommand({
            TableName: WISHES_TABLE_NAME,
            Key: { id },
        });

        const getResult = await docClient.send(getCommand);
        const wish = getResult.Item as { picture?: string | null } | undefined;

        // Delete the wish from DynamoDB
        const deleteCommand = new DeleteCommand({
            TableName: WISHES_TABLE_NAME,
            Key: { id },
        });

        await docClient.send(deleteCommand);

        // Cascade delete: if wish had a picture, delete it from S3
        if (wish?.picture && UPLOAD_BUCKET_NAME) {
            try {
                // Extract S3 key from the public URL
                const url = new URL(wish.picture);
                const key = url.pathname.replace(/^\//, '');

                const deleteObjectCommand = new DeleteObjectCommand({
                    Bucket: UPLOAD_BUCKET_NAME,
                    Key: key,
                });

                await s3Client.send(deleteObjectCommand);
                console.log(`Deleted S3 object: ${key}`);
            } catch (s3Err: unknown) {
                // Log but don't fail — the wish is already deleted
                console.log('Failed to delete S3 object: ', s3Err);
            }
        }

        return {
            statusCode: 200,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Wish successfully removed' }),
        };
    } catch (err: unknown) {
        const error = err as { message: string };

        return {
            statusCode: 500,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
