import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
    throw new Error('COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set');
}

const generateAllowPolicy = (principalId: string, methodArn: string) => ({
    principalId: principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: methodArn,
            },
        ],
    },
});

const generateDenyPolicy = (principalId: string, methodArn: string) => ({
    principalId: principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: 'Deny',
                Resource: methodArn,
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

        return generateDenyPolicy('unknown', event.methodArn);
    }

    const [key, value] = token.split(' ');

    if (key !== 'Bearer') {
        console.log('No Bearer token');

        return generateDenyPolicy('unknown', event.methodArn);
    }

    if (!value) {
        console.log('No token provided value');

        return generateDenyPolicy('unknown', event.methodArn);
    }

    const verifier = CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        clientId: COGNITO_CLIENT_ID,
    });

    return verifier
        .verify(value)
        .then(token => {
            console.log('Token verified');
            const { sub } = token;

            return generateAllowPolicy(sub, event.methodArn);
        })
        .catch((err: unknown) => {
            console.log('Token not verified. Error: ', err);

            return generateDenyPolicy('unknown', event.methodArn);
        });
};
