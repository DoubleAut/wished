import {
    AdminGetUserCommand,
    CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import {
    DynamoDBClient,
    QueryCommand,
    TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../../errors';
import { GetUserDataPayload, getUserData } from '../helpers';

const TABLE_NAME = process.env.FRIENDS_TABLE_NAME;
const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (!TABLE_NAME || !COGNITO_REGION) {
    throw new Error('FRIENDS_TABLE_NAME and COGNITO_REGION must be set');
}

const dynamoClient = new DynamoDBClient({ region: COGNITO_REGION });
const cognitoClient = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

const getFriendUserIds = async (userId: string): Promise<string[]> => {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': { S: userId },
        },
    });

    const result = await dynamoClient.send(command);

    return (
        result.Items?.map(item => item.friendId?.S ?? '').filter(
            id => id !== '',
        ) ?? []
    );
};

const getUserByUsername = async (username: string) => {
    try {
        const command = new AdminGetUserCommand({
            Username: username,
            UserPoolId: COGNITO_USER_POOL_ID,
        });

        const result = await cognitoClient.send(command);

        return getUserData(result as GetUserDataPayload);
    } catch {
        return null;
    }
};

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('Adding friend...');

    const userId = event.pathParameters?.username;
    const friendId = event.pathParameters?.friendId;

    if (!userId || !friendId) {
        return getErrorResponse(400, 'userId and friendId are required');
    }

    const accessToken = event.headers['Authorization'] as string;

    if (!accessToken) {
        return getErrorResponse(401, 'No access token provided');
    }

    const splitted = accessToken.split(' ') as [string, string];
    const [_key, value] = splitted;

    if (!value) {
        return getErrorResponse(401, 'No access token provided');
    }

    try {
        // Create bidirectional friendship entries
        const command = new TransactWriteItemsCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: TABLE_NAME,
                        Item: {
                            userId: { S: userId },
                            friendId: { S: friendId },
                            createdAt: { S: new Date().toISOString() },
                        },
                        ConditionExpression:
                            'attribute_not_exists(userId) AND attribute_not_exists(friendId)',
                    },
                },
                {
                    Put: {
                        TableName: TABLE_NAME,
                        Item: {
                            userId: { S: friendId },
                            friendId: { S: userId },
                            createdAt: { S: new Date().toISOString() },
                        },
                        ConditionExpression:
                            'attribute_not_exists(userId) AND attribute_not_exists(friendId)',
                    },
                },
            ],
        });

        await dynamoClient.send(command);

        // Fetch updated followings
        const friendIds = await getFriendUserIds(userId);

        const friendDetails = await Promise.all(
            friendIds.map(id => getUserByUsername(id)),
        );

        const validFriends = friendDetails.filter(
            (user): user is NonNullable<typeof user> => user !== null,
        );

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followings: validFriends,
                followers: [],
            }),
        };
    } catch (error) {
        console.log('Command execution failed. Error: ', error);

        if ((error as Error).name === 'TransactionCanceledException') {
            return getErrorResponse(409, 'Friendship already exists');
        }

        return getErrorResponse(500, 'Unknown error. Please contact support');
    }
};
