import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    QueryCommand,
    QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Wish } from '../../models';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.WISHES_TABLE_NAME;

if (!TABLE_NAME) {
    throw new Error('Missing TABLE_NAME variable.');
}

const STATUS_INDEX_NAME = 'status';

const commonOptions: QueryCommandInput = {
    TableName: TABLE_NAME,
    IndexName: STATUS_INDEX_NAME,
    KeyConditionExpression: '#status = :status',
};

const queryWishes = async <T>(params: QueryCommandInput): Promise<T> => {
    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    if (result.Items) {
        return result.Items as T;
    }

    return [] as T;
};

/**
 * Get archived wishes (isHidden = true)
 * Most efficient: Uses GSI on status field
 */
export const getArchivedWishes = (userId: string) => {
    const params: QueryCommandInput = {
        ...commonOptions,
        FilterExpression: '#userId = :userId AND #attribute = :value',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#userId': 'userId',
        },
        ExpressionAttributeValues: {
            ':status': 'archived', // Assuming you set status when archiving
            ':userId': userId,
        },
    };

    return queryWishes<Wish[]>(params);
};

/**
 * Get gifted wishes (isCompleted = true AND reservedBy != 'None')
 * Efficient query using GSI on status + filter
 */
export const getGiftedWishes = (userId: string) => {
    const params: QueryCommandInput = {
        ...commonOptions,
        FilterExpression: '#userId = :userId AND #reservedBy = :reservedBy',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#userId': 'userId',
            '#reservedBy': 'reservedBy',
        },
        ExpressionAttributeValues: {
            ':status': 'gifted', // Assuming you set status when gift is completed
            ':userId': userId,
            ':reservedBy': 'None',
        },
    };

    return queryWishes<Wish[]>(params);
};

/**
 * Get reserved wishes (reservedBy != 'None' AND isCompleted = false)
 */
export const getReservedWishes = (userId: string) => {
    const params: QueryCommandInput = {
        ...commonOptions,
        FilterExpression:
            '#userId = :userId AND #isCompleted = :isCompleted AND #reservedBy = :reservedBy',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#userId': 'userId',
        },
        ExpressionAttributeValues: {
            ':status': 'reserved', // Assuming you set status when reserved
            ':userId': userId,
        },
    };

    return queryWishes<Wish[]>(params);
};

/**
 * Get active wishes (isHidden = false AND isCompleted = false AND reservedBy = 'None')
 */
export const getActiveWishes = (userId: string) => {
    const params: QueryCommandInput = {
        ...commonOptions,
        FilterExpression: '#userId = :userId AND #isHidden = :isHidden',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#userId': 'userId',
            '#isHidden': 'isHidden',
        },
        ExpressionAttributeValues: {
            ':status': 'active', // Assuming you set status to active by default
            ':userId': userId,
            ':isHidden': false,
        },
    };

    return queryWishes<Wish[]>(params);
};
