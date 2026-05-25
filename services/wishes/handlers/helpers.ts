import { APIGatewayProxyEvent } from 'aws-lambda';
import { Wish } from '../../../shared/types/Wish';

export const getTypesafeBodyOrNull = <T>(body: string | null) =>
    body ? (JSON.parse(body) as T) : null;

// Wish-related helper functions
export type WishStatus = 'active' | 'reserved' | 'gifted' | 'archived';

export interface ExtendedWish extends Wish {
    status: WishStatus;
    giftedBy?: string;
    archivedAt?: string;
}

// Helper function to determine wish status based on its properties
export const determineWishStatus = (wish: Wish): WishStatus => {
    // Archived takes precedence - if hidden, it's archived
    if (wish.isHidden) {
        return 'archived';
    }
    // Gifted: completed and reserved by someone
    if (wish.isCompleted && wish.reservedBy !== 'None') {
        return 'gifted';
    }
    // Reserved: reserved by someone but not completed
    if (wish.reservedBy && wish.reservedBy !== 'None') {
        return 'reserved';
    }
    // Otherwise active
    return 'active';
};

// Helper function to check if a wish should be visible to the requesting user
export const isWishVisibleToUser = (
    wish: ExtendedWish,
    requestingUserId?: string,
): boolean => {
    const { status, ownerId, reservedBy } = wish;

    // If no user is specified (public access), only show active wishes
    if (!requestingUserId) {
        return status === 'active';
    }

    // Check visibility based on status
    switch (status) {
        case 'active':
            // Active wishes are visible to everyone
            return true;

        case 'reserved':
            // Reserved wishes are visible to:
            // 1. The person who reserved it (reservedBy)
            // 2. The wish owner (ownerId)
            return (
                requestingUserId === reservedBy || requestingUserId === ownerId
            );

        case 'gifted':
            // Gifted wishes are visible to:
            // 1. The wish owner (ownerId)
            // 2. The person who reserved it (reservedBy) - assumed to be the gifter
            return (
                requestingUserId === ownerId || requestingUserId === reservedBy
            );

        case 'archived':
            // Archived wishes are visible only to the wish owner
            return requestingUserId === ownerId;

        default:
            return false;
    }
};

export const filterWishesByVisibility = (
    wishes: Wish[],
    requestingUserId?: string,
): ExtendedWish[] => {
    return wishes
        .map(wish => ({
            ...wish,
            status: determineWishStatus(wish),
        }))
        .filter(wish => isWishVisibleToUser(wish, requestingUserId));
};

// Helper function to get user ID from request
export const getRequestingUserId = (
    event: APIGatewayProxyEvent,
): string | undefined => {
    // Try to get user ID from API Gateway authorizer context
    const authorizer = event.requestContext?.authorizer;
    if (authorizer?.principalId) {
        return authorizer.principalId;
    }

    // Fallback to query parameter for development/testing
    return event.queryStringParameters?.userId;
};

export const getDefaultHeaders = () => ({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
});
