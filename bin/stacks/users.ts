import {
    CfnOutput,
    Duration,
    Fn,
    RemovalPolicy,
    Stack,
    StackProps,
} from 'aws-cdk-lib';
import {
    Cors,
    LambdaIntegration,
    RestApi,
    TokenAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
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

        const authorizationHandlerArn = Fn.importValue('TokenAuthorizerArn');
        const authorizationHandler = Function.fromFunctionArn(
            this,
            'TokenAuthorizerHandler',
            authorizationHandlerArn,
        );

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
            accessTokenValidity: Duration.minutes(5),
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

        const authenticationHandler = new NodejsFunction(
            this,
            'AuthenticationHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_REGION: this.region,
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                    COGNITO_CLIENT_SECRET:
                        userClient.userPoolClientSecret.unsafeUnwrap(),
                    COGNITO_USER_POOL_ID: userPool.userPoolId,
                },
                functionName: 'AuthenticationHandler',
                entry: path.join(lambdaPath, 'authenticate.ts'),
            },
        );

        const rotateTokensHandler = new NodejsFunction(
            this,
            'RotateTokensHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_REGION: this.region,
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                    COGNITO_CLIENT_SECRET:
                        userClient.userPoolClientSecret.unsafeUnwrap(),
                    COGNITO_USER_POOL_ID: userPool.userPoolId,
                },
                functionName: 'RotateTokensHandler',
                entry: path.join(lambdaPath, 'rotateTokens.ts'),
            },
        );

        const confirmSignUpHandler = new NodejsFunction(
            this,
            'ConfirmSignUpHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_REGION: this.region,
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                    COGNITO_CLIENT_SECRET:
                        userClient.userPoolClientSecret.unsafeUnwrap(),
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

        const integrationRole = new Role(this, 'authExecutionRole', {
            assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
        });

        authorizationHandler.grantInvoke(integrationRole);

        const authorizer = new TokenAuthorizer(this, 'TokenAuthorizer', {
            handler: authorizationHandler,
            authorizerName: 'TokenAuthorizer',
            assumeRole: integrationRole,
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

        const authenticationPolicy = new PolicyStatement({
            actions: ['cognito-idp:InitiateAuth'],
            resources: [userPool.userPoolArn],
        });
        authenticationHandler.addToRolePolicy(authenticationPolicy);
        rotateTokensHandler.addToRolePolicy(authenticationPolicy);

        const restApi = new RestApi(this, 'UsersApi', {
            restApiName: 'UsersApi',
            description: 'Users API',
        });

        const apiEndpoint = restApi.root.addResource('users', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: ['GET'],
            },
        });
        const signUpEndpoint = apiEndpoint.addResource('register');
        const confirmSignUpEndpoint = apiEndpoint.addResource('confirm');
        const authenticationEndpoint = apiEndpoint.addResource('auth', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: Cors.ALL_METHODS,
                allowCredentials: true,
            },
        });
        const rotateTokensEndpoint = apiEndpoint.addResource('rotate', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: Cors.ALL_METHODS,
                allowCredentials: true,
            },
        });

        const getUserEnpoint = apiEndpoint;

        signUpEndpoint.addMethod('POST', new LambdaIntegration(signUpHandler));
        getUserEnpoint.addMethod('GET', new LambdaIntegration(getUserHandler), {
            authorizer: authorizer,
        });
        confirmSignUpEndpoint.addMethod(
            'POST',
            new LambdaIntegration(confirmSignUpHandler),
        );
        authenticationEndpoint.addMethod(
            'POST',
            new LambdaIntegration(authenticationHandler),
        );
        rotateTokensEndpoint.addMethod(
            'POST',
            new LambdaIntegration(rotateTokensHandler),
        );

        new CfnOutput(this, 'ApiEndpoint', {
            value: restApi.url,
            exportName: 'ApiEndpoint',
        });

        new CfnOutput(this, 'UserPoolPoolId', {
            value: userPool.userPoolId,
            exportName: 'UserPoolId',
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
