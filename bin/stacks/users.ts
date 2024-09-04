import {
    CfnOutput,
    Duration,
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
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';
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
            accessTokenValidity: Duration.minutes(5),
        });

        const TokenAuthorizerHandler = new NodejsFunction(
            this,
            'TokenAuthorizerHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                    COGNITO_USER_POOL_ID: userPool.userPoolId,
                },
                functionName: 'TokenAuthorizerHandler',
                entry: path.join(lambdaPath, 'authorizeRequest.ts'),
            },
        );

        const registerHandler = new NodejsFunction(this, 'RegisterHandler', {
            ...commonLambdaProps,
            environment: {
                COGNITO_REGION: this.region,
                COGNITO_CLIENT_ID: userClient.userPoolClientId,
                COGNITO_CLIENT_SECRET:
                    userClient.userPoolClientSecret.unsafeUnwrap(),
            },
            functionName: 'RegisterHandler',
            entry: path.join(lambdaPath, 'register.ts'),
        });

        const loginHandler = new NodejsFunction(this, 'LoginHandler', {
            ...commonLambdaProps,
            environment: {
                COGNITO_REGION: this.region,
                COGNITO_CLIENT_ID: userClient.userPoolClientId,
                COGNITO_CLIENT_SECRET:
                    userClient.userPoolClientSecret.unsafeUnwrap(),
                COGNITO_USER_POOL_ID: userPool.userPoolId,
            },
            functionName: 'LoginHandler',
            entry: path.join(lambdaPath, 'login.ts'),
        });

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

        const confirmRegisterHandler = new NodejsFunction(
            this,
            'ConfirmRegisterHandler',
            {
                ...commonLambdaProps,
                environment: {
                    COGNITO_REGION: this.region,
                    COGNITO_CLIENT_ID: userClient.userPoolClientId,
                    COGNITO_CLIENT_SECRET:
                        userClient.userPoolClientSecret.unsafeUnwrap(),
                },
                functionName: 'ConfirmRegisterHandler',
                entry: path.join(lambdaPath, 'confirmation.ts'),
            },
        );

        const getUserHandler = new NodejsFunction(this, 'GetUserHandler', {
            ...commonLambdaProps,
            environment: { COGNITO_REGION: this.region },
            functionName: 'GetUserHandler',
            entry: path.join(lambdaPath, 'getUser.ts'),
        });

        const integrationRole = new Role(this, 'authExecutionRole', {
            assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
        });

        TokenAuthorizerHandler.grantInvoke(integrationRole);

        const authorizer = new TokenAuthorizer(this, 'TokenAuthorizer', {
            handler: TokenAuthorizerHandler,
            authorizerName: 'TokenAuthorizer',
            assumeRole: integrationRole,
            resultsCacheTtl: Duration.minutes(0),
        });

        const registerPolicy = new PolicyStatement({
            actions: ['cognito-idp:SignUp'],
            resources: [userPool.userPoolArn],
        });
        registerHandler.addToRolePolicy(registerPolicy);

        const loginPolicy = new PolicyStatement({
            actions: ['cognito-idp:GetUser'],
            resources: [userPool.userPoolArn],
        });
        getUserHandler.addToRolePolicy(loginPolicy);

        const confirmPolicy = new PolicyStatement({
            actions: ['cognito-idp:ConfirmSignUp'],
            resources: [userPool.userPoolArn],
        });
        confirmRegisterHandler.addToRolePolicy(confirmPolicy);

        const authenticationPolicy = new PolicyStatement({
            actions: ['cognito-idp:InitiateAuth'],
            resources: [userPool.userPoolArn],
        });
        loginHandler.addToRolePolicy(authenticationPolicy);
        rotateTokensHandler.addToRolePolicy(authenticationPolicy);

        const restApi = new RestApi(this, 'UsersApi', {
            restApiName: 'UsersApi',
            description: 'Users API',
        });

        const apiEndpoint = restApi.root.addResource('users', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: ['GET'],
                allowCredentials: true,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
        });

        const registerEndpoint = apiEndpoint.addResource('register');
        const confirmRegisterEndpoint = apiEndpoint.addResource('confirm');
        const loginEndpoint = apiEndpoint.addResource('login', {
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

        registerEndpoint.addMethod(
            'POST',
            new LambdaIntegration(registerHandler),
        );
        apiEndpoint.addMethod('GET', new LambdaIntegration(getUserHandler), {
            authorizer: authorizer,
        });
        confirmRegisterEndpoint.addMethod(
            'POST',
            new LambdaIntegration(confirmRegisterHandler),
        );
        loginEndpoint.addMethod('POST', new LambdaIntegration(loginHandler));
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
