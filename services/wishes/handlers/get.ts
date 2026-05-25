import {
    APIGatewayEvent,
    APIGatewayProxyEventPathParameters,
} from 'aws-lambda';
import { Wish } from '../models';
import {
    getActiveWishes,
    getArchivedWishes,
    getGiftedWishes,
    getReservedWishes,
} from './api';
import { WishStatus } from './helpers';

const getStatusFromPathParameters = (
    param: APIGatewayProxyEventPathParameters | null,
) => {
    const status = param?.status;

    if (!status) {
        return null;
    }

    if (!['active', 'reserved', 'gifted', 'archived'].includes(status)) {
        return null;
    }

    return status as WishStatus;
};

/**
 * Efficient handler for getting wishes by status
 * Uses GSI on 'status' field for optimal query performance
 */
export const handler = async (event: APIGatewayEvent) => {
    try {
        const status = getStatusFromPathParameters(event.pathParameters);

        if (!status) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'Invalid status.',
                }),
            };
        }

        const userId = event.requestContext?.authorizer?.claims?.sub; // Assuming Cognito auth

        let wishes: Wish[] = [];

        if (status === 'archived') {
            // Archived wishes: isHidden = true (using GSI for efficient query)
            wishes = await getArchivedWishes(userId);
        } else if (status === 'gifted') {
            // Gifted wishes: isCompleted = true AND reservedBy != 'None'
            wishes = await getGiftedWishes(userId);
        } else if (status === 'reserved') {
            // Reserved wishes: reservedBy != 'None' AND isCompleted = false
            wishes = await getReservedWishes(userId);
        } else if (status === 'active') {
            // Active wishes: isHidden = false AND isCompleted = false AND reservedBy = 'None'
            wishes = await getActiveWishes(userId);
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wishes,
                count: wishes.length,
            }),
        };
    } catch (error) {
        console.error('Error fetching wishes:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to fetch wishes' }),
        };
    }
};

export default handler;
