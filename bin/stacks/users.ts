import {
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    StackProps,
} from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { commonLambdaProps } from './helpers';

const wishedUserPoolName = 'wished-user-pool';
const rootDir = path.join(__dirname, '../../');
const lambdaPath = path.join(rootDir, 'services', 'users');

export class UsersStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(this, wishedUserPoolName, {
            userPoolName: wishedUserPoolName,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            autoVerify: {
                email: true,
                phone: false,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const userClient = userPool.addClient('wished-client', {
            generateSecret: true,
            userPoolClientName: 'wished-client',
            authFlows: {
                userPassword: true,
            },
            accessTokenValidity: Duration.minutes(10),
        });

        const signUpHandler = new NodejsFunction(this, 'SignUpHandler', {
            ...commonLambdaProps,
            environment: {
                COGNITO_REGION: this.region,
                COGNITO_CLIENT_ID: userClient.userPoolClientId,
                COGNITO_CLIENT_SECRET:
                    userClient.userPoolClientSecret.unsafeUnwrap(),
            },
            functionName: 'SignUpHandler',
            entry: path.join(lambdaPath, 'register.ts'),
        });

        const confirmSignUpHandler = new NodejsFunction(
            this,
            'ConfirmSignUpHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_REGION: this.region,
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                },
                functionName: 'ConfirmSignUpHandler',
                entry: path.join(lambdaPath, 'confirmation.ts'),
            },
        );

        const getUserHandler = new NodejsFunction(this, 'GetUserHandler', {
            ...commonLambdaProps,
            environment: {
                COGNITO_REGION: this.region,
                COGNITO_CLIENT_ID: userPool.userPoolId,
            },
            functionName: 'GetUserHandler',
            entry: path.join(lambdaPath, 'getUser.ts'),
        });

        const registerPolicy = new PolicyStatement({
            actions: ['cognito-idp:SignUp'],
            resources: [userPool.userPoolArn],
        });
        signUpHandler.addToRolePolicy(registerPolicy);

        const loginPolicy = new PolicyStatement({
            actions: ['cognito-idp:GetUser'],
            resources: [userPool.userPoolArn],
        });
        getUserHandler.addToRolePolicy(loginPolicy);

        const confirmPolicy = new PolicyStatement({
            actions: ['cognito-idp:ConfirmSignUp'],
            resources: [userPool.userPoolArn],
        });
        confirmSignUpHandler.addToRolePolicy(confirmPolicy);

        const restApi = new RestApi(this, 'UsersApi', {
            restApiName: 'UsersApi',
            description: 'Users API',
            defaultCorsPreflightOptions: {
                allowOrigins: [
                    'http://localhost:3000',
                    'https://www.wished.richardpickman.space',
                ],
                allowMethods: Cors.ALL_METHODS,
            },
        });

        const apiEndpoint = restApi.root.addResource('users');

        const signUpEndpoint = apiEndpoint.addResource('register');
        const confirmSignUpEndpoint = apiEndpoint.addResource('confirm');

        signUpEndpoint.addMethod('POST', new LambdaIntegration(signUpHandler));
        apiEndpoint.addMethod('POST', new LambdaIntegration(getUserHandler));
        confirmSignUpEndpoint.addMethod(
            'POST',
            new LambdaIntegration(confirmSignUpHandler),
        );

        new CfnOutput(this, 'cognitoUserPoolId', {
            value: userPool.userPoolId,
            exportName: 'CognitoUserPoolId',
        });

        new CfnOutput(this, 'usersApiEndpoint', {
            value: restApi.url,
            exportName: 'UsersApi',
        });

        new CfnOutput(this, 'signInLamdaHandlerArn', {
            value: getUserHandler.functionArn,
            exportName: 'SignInLambdaHandlerArn',
        });

        new CfnOutput(this, 'signUpLamdaHandlerArn', {
            value: signUpHandler.functionArn,
            exportName: 'SignUpLambdaHandlerArn',
        });

        new CfnOutput(this, 'confirmSignUpLamdaHandlerArn', {
            value: confirmSignUpHandler.functionArn,
            exportName: 'ConfirmSignUpLambdaHandlerArn',
        });

        new CfnOutput(this, 'UserPoolClientId', {
            value: userClient.userPoolClientId,
            exportName: 'UserPoolClientId',
        });

        new CfnOutput(this, 'UserPoolClientSecret', {
            value: userClient.userPoolClientSecret.unsafeUnwrap(),
            exportName: 'UserPoolClientSecret',
        });
    }
}
