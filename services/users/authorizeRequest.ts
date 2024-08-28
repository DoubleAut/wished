import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
    throw new Error('COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set');
}

const Resource = [
    'cognito-idp:SignUp',
    'cognito-idp:GetUser',
    'cognito-idp:ConfirmSignUp',
    'cognito-idp:InitiateAuth',
];

const generatePolicy = (principalId: string, effect: string) => ({
    principalId: principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource,
            },
        ],
    },
});

export const handler = async (event: APIGatewayTokenAuthorizerEvent) => {
    console.log('This handler is called by API Gateway', event);

    const token = event.authorizationToken;

    console.log('Proceeding with token', token);

    if (!token) {
        console.log('No token');

        return generatePolicy('unauthenticated', 'Deny');
    }

    const [key, value] = token.split(' ');

    if (key !== 'Bearer') {
        console.log('No Bearer token');

        return generatePolicy('unauthenticated', 'Deny');
    }

    if (!value) {
        console.log('No token provided value');

        return generatePolicy('unauthenticated', 'Deny');
    }

    const verifier = CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        clientId: COGNITO_CLIENT_ID,
    });

    verifier
        .verify(value)
        .then(() => generatePolicy('authenticated', 'Allow'))
        .catch(() => generatePolicy('unauthenticated', 'Deny'));
};
