import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { commonLambdaProps } from './helpers';

const rootDir = path.join(__dirname, '../../');
const lambdaPath = path.join(rootDir, 'services', 'wishes');

export class WishesStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const wishesTable = new Table(this, 'WishesTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        wishesTable.addGlobalSecondaryIndex({
            indexName: 'ownerId',
            partitionKey: {
                name: 'ownerId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'id',
                type: AttributeType.STRING,
            },
        });

        const environment = {
            WISHES_TABLE_NAME: wishesTable.tableName,
        };

        const createWishHandler = new NodejsFunction(
            this,
            'CreateWishHandler',
            {
                ...commonLambdaProps,
                functionName: 'CreateWishHandler',
                entry: path.join(lambdaPath, 'create.ts'),
                environment,
            },
        );

        const deleteWishHandler = new NodejsFunction(
            this,
            'DeleteWishHandler',
            {
                ...commonLambdaProps,
                functionName: 'DeleteWishHandler',
                entry: path.join(lambdaPath, 'delete.ts'),
                environment,
            },
        );

        const getWishHandler = new NodejsFunction(this, 'GetWishHandler', {
            ...commonLambdaProps,
            functionName: 'GetWishHandler',
            entry: path.join(lambdaPath, 'get.ts'),
            environment,
        });

        const getListedWishHandler = new NodejsFunction(
            this,
            'GetListedWishHandler',
            {
                ...commonLambdaProps,
                functionName: 'GetListedWishHandler',
                entry: path.join(lambdaPath, 'getListed.ts'),
                environment,
            },
        );

        const updateWishHandler = new NodejsFunction(
            this,
            'UpdateWishHandler',
            {
                ...commonLambdaProps,
                functionName: 'UpdateWishHandler',
                entry: path.join(lambdaPath, 'update.ts'),
                environment,
            },
        );

        const principal = new AccountPrincipal(this.account);

        // Get wish permissions
        const getWishPolicy = new PolicyStatement({
            actions: ['dynamodb:GetItem'],
            resources: [wishesTable.tableArn],
        });
        getWishHandler.addToRolePolicy(getWishPolicy);

        // List wishes permissions
        const listWishesPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:Query'],
            resources: [
                wishesTable.tableArn,
                `${wishesTable.tableArn}/index/ownerId`,
            ],
        });
        getListedWishHandler.addToRolePolicy(listWishesPolicy);

        // PUT permissions
        const putWishPolicy = new PolicyStatement({
            actions: ['dynamodb:PutItem'],
            resources: [wishesTable.tableArn],
        });
        createWishHandler.addToRolePolicy(putWishPolicy);
        updateWishHandler.addToRolePolicy(putWishPolicy);

        // DELETE permissions
        const deleteWishPolicy = new PolicyStatement({
            actions: ['dynamodb:DeleteItem'],
            resources: [wishesTable.tableArn],
        });
        deleteWishHandler.addToRolePolicy(deleteWishPolicy);

        const api = new RestApi(this, 'WishesApi', {
            restApiName: 'WishesApi',
            description: 'Wishes API',
            defaultCorsPreflightOptions: {
                allowOrigins: [
                    'http://localhost:3000',
                    'https://www.wished.richardpickman.space',
                ],
                allowMethods: Cors.ALL_METHODS,
            },
        });

        const apiEndpoint = api.root.addResource('wishes');
        const getSingleWishEndpoint = apiEndpoint.addResource('{id}');

        const listWishesEndpoint = apiEndpoint.addResource('list');
        const listWishesByOwnerEndpoint =
            listWishesEndpoint.addResource('{ownerId}');

        const deleteWishEndpoint = apiEndpoint.addResource('{wishId}');

        getSingleWishEndpoint.addMethod(
            'GET',
            new LambdaIntegration(getWishHandler),
        );
        listWishesByOwnerEndpoint.addMethod(
            'GET',
            new LambdaIntegration(getListedWishHandler),
        );
        apiEndpoint.addMethod('POST', new LambdaIntegration(createWishHandler));
        apiEndpoint.addMethod('PUT', new LambdaIntegration(updateWishHandler));
        deleteWishEndpoint.addMethod(
            'DELETE',
            new LambdaIntegration(deleteWishHandler),
        );

        new CfnOutput(this, 'WishesTableName', {
            value: wishesTable.tableName,
            exportName: 'WishesTable',
        });

        new CfnOutput(this, 'WishesApiEndpoint', {
            value: api.url,
            exportName: 'WishesApi',
        });
    }
}
