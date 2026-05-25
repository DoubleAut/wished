import {
    AdminGetUserCommand,
    CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getErrorResponse } from '../../errors';
import { GetUserDataPayload, getUserData } from '../helpers';

const TABLE_NAME = process.env.FRIENDS_TABLE_NAME;
const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (!TABLE_NAME || !COGNITO_REGION || !COGNITO_USER_POOL_ID) {
    throw new Error(
        'FRIENDS_TABLE_NAME, COGNITO_REGION, and COGNITO_USER_POOL_ID must be set',
    );
}

const dynamoClient = new DynamoDBClient({ region: COGNITO_REGION });
const cognitoClient = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

interface FriendRecord {
    userId: string;
    friendId: string;
    createdAt: string;
}

const getFriendUserIds = async (userId: string): Promise<FriendRecord[]> => {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': { S: userId },
        },
    });

    const result = await dynamoClient.send(command);

    return (
        result.Items?.map(item => ({
            userId: item.userId?.S ?? '',
            friendId: item.friendId?.S ?? '',
            createdAt: item.createdAt?.S ?? '',
        })) ?? []
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
    console.log('Listing friends...');

    const userId = event.pathParameters?.username;

    if (!userId) {
        return getErrorResponse(400, 'userId is required');
    }

    try {
        const friendRecords = await getFriendUserIds(userId);

        // Fetch user details for each friend
        const friendDetails = await Promise.all(
            friendRecords.map(record => getUserByUsername(record.friendId)),
        );

        const validFriends = friendDetails.filter(
            (user): user is NonNullable<typeof user> => user !== null,
        );

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followings: validFriends,
                followers: [], // For now, followers are the same as followings (bidirectional)
            }),
        };
    } catch (error) {
        console.log('Command execution failed. Error: ', error);

        return getErrorResponse(500, 'Unknown error. Please contact support');
    }
};
