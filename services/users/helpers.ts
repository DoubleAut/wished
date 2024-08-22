import {
    AttributeType,
    GetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

export const getValueOrNullFromAttributeArray = (
    key: string,
    data: AttributeType[],
) => {
    const value = data.find(attr => attr.Name === key)?.Value;

    return value ?? null;
};

export type GetUserDataPayload = GetUserCommandOutput & {
    Username: string;
    UserAttributes: AttributeType[];
};

export const getUserData = (payload: GetUserDataPayload) => ({
    id: payload.Username,
    username: payload.Username,
    email: getValueOrNullFromAttributeArray('email', payload.UserAttributes),
    isActive: getValueOrNullFromAttributeArray(
        'email_verified',
        payload.UserAttributes,
    ),
    picture: getValueOrNullFromAttributeArray(
        'picture',
        payload.UserAttributes,
    ),
    name: getValueOrNullFromAttributeArray('name', payload.UserAttributes),
    surname: getValueOrNullFromAttributeArray(
        'surname',
        payload.UserAttributes,
    ),
});
