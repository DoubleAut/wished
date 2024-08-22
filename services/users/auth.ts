import {
    CognitoIdentityProviderClient,
    GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { GetUserDataPayload, getUserData } from './helpers';

const COGNITO_REGION = process.env.COGNITO_REGION;

export const getCognitoUser = async (accessToken: string) => {
    const client = new CognitoIdentityProviderClient({
        region: COGNITO_REGION,
    });

    const command = new GetUserCommand({
        AccessToken: accessToken,
    });

    try {
        const result = await client.send(command);

        if (!result.Username) {
            console.error('Username is null');

            return null;
        }

        if (!result.UserAttributes) {
            console.error('UserAttributes is null');

            return null;
        }

        const userData = getUserData(result as GetUserDataPayload);

        return userData ?? null;
    } catch (error) {
        console.error(error);

        return null;
    }
};
