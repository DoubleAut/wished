import {
    CognitoIdentityProviderClient,
    SignUpCommand,
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
    username: string;
    password: string;
    email: string;
};

export const handler = async (event: any) => {
    console.log('User creating with', event.body);

    const credentials = JSON.parse(event.body) as Payload;

    const signUpCommand = new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: credentials.username,
        Password: credentials.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: credentials.email,
            },
        ],
    });

    try {
        console.log('Signing up...', signUpCommand);

        const result = await client.send(signUpCommand);

        console.log('Command executed. Result: ', result);

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
