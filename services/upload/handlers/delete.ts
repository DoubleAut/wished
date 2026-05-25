import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getDefaultHeaders } from '../../helpers';

const s3Client = new S3Client();

const BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME || '';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';

const getVerifier = () =>
    CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        clientId: COGNITO_CLIENT_ID,
    });

const extractUserId = async (
    event: APIGatewayProxyEvent,
): Promise<string | null> => {
    const authHeader =
        event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    const token = parts[1] as string;

    try {
        const verifier = getVerifier();
        const payload = await verifier.verify(token);

        return payload.sub;
    } catch {
        return null;
    }
};

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Delete upload request: ', event.body);

    const userId = await extractUserId(event);

    if (!userId) {
        return {
            statusCode: 401,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }

    const key = event.pathParameters?.key;

    if (!key) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Missing key parameter' }),
        };
    }

    // Verify ownership — key must start with uploads/{userId}/
    const expectedPrefix = `uploads/${userId}/`;

    if (!key.startsWith(expectedPrefix)) {
        return {
            statusCode: 403,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                message: 'Forbidden: you do not own this file',
            }),
        };
    }

    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        await s3Client.send(deleteObjectCommand);

        return {
            statusCode: 200,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'File deleted successfully' }),
        };
    } catch (err: unknown) {
        console.log('Failed to delete file: ', err);
        const error = err as { message: string };

        return {
            statusCode: 500,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: error.message }),
        };
    }
};
