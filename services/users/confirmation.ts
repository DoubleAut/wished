import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const COGNITO_REGION = process.env.COGNITO_REGION;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

if (!COGNITO_CLIENT_ID || !COGNITO_REGION) {
    throw new Error('COGNITO_CLIENT_ID is required');
}

const client = new CognitoIdentityProviderClient({
    region: COGNITO_REGION,
});

type Payload = {
    code: string;
    username: string;
};

export const handler = async (event: any) => {
    console.log('User creating with', event.body);

    const credentials = JSON.parse(event.body) as Payload;

    const confirmSignUpCommand = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: credentials.username,
        ConfirmationCode: credentials.code,
    });

    try {
        console.log('Confirming sign up...', confirmSignUpCommand);

        const result = await client.send(confirmSignUpCommand);

        console.log('Command executed. Result: ', result);

        const statusCode = result.$metadata.httpStatusCode;

        if (statusCode && statusCode >= 400) {
            console.error('Error occurred');

            return {
                statusCode: statusCode,
                body: JSON.stringify({
                    message: 'Something went wrong',
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.log('Command failed. Error: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
