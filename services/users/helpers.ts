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

export const getBooleanFromAttribueValue = (
    key: string,
    data: AttributeType[],
) => {
    const value = getValueOrNullFromAttributeArray(key, data);

    if (!value) {
        return null;
    }

    return value === 'true';
};

export type GetUserDataPayload = GetUserCommandOutput & {
    Username: string;
    UserAttributes: AttributeType[];
};

export const getUserData = (payload: GetUserDataPayload) => ({
    id: payload.Username,
    username: payload.Username,
    email: getValueOrNullFromAttributeArray('email', payload.UserAttributes),
    isActive: getBooleanFromAttribueValue(
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

export const getCommonHeaders = () => {
    const headers = new Headers();

    headers.append(
        'Access-Control-Allow-Origin',
        'http://localhost:3000,https://www.wished.richardpickman.space',
    );
    headers.append('Access-Control-Allow-Methods', '*');
    headers.append('Access-Control-Allow-Headers', '*');

    headers.append('Content-Type', 'application/json');

    return headers;
};
