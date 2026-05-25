import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { getDefaultHeaders } from '../../helpers';

const s3Client = new S3Client();

const BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME || '';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PresignRequest {
    fileName: string;
    fileType: string;
    fileSize: number;
}

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
    console.log('Presign request: ', event.body);

    const userId = await extractUserId(event);

    if (!userId) {
        return {
            statusCode: 401,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'No body provided' }),
        };
    }

    let body: PresignRequest;

    try {
        body = JSON.parse(event.body) as PresignRequest;
    } catch {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: 'Invalid JSON body' }),
        };
    }

    const { fileName, fileType, fileSize } = body;

    if (!fileName || !fileType || !fileSize) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                message:
                    'Missing required fields: fileName, fileType, fileSize',
            }),
        };
    }

    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
            }),
        };
    }

    if (fileSize > MAX_FILE_SIZE) {
        return {
            statusCode: 400,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                message: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            }),
        };
    }

    const extension = fileName.split('.').pop() || 'jpg';
    const uuid = randomUUID();
    const key = `uploads/${userId}/${uuid}.${extension}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    try {
        const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
            expiresIn: 900,
        });

        const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return {
            statusCode: 200,
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                presignedUrl,
                publicUrl,
                key,
            }),
        };
    } catch (err: unknown) {
        console.log('Failed to generate presigned URL: ', err);
        const error = err as { message: string };

        return {
            statusCode: 500,
            headers: getDefaultHeaders(),
            body: JSON.stringify({ message: error.message }),
        };
    }
};
