import { CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Effect, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from 'path';
import { commonLambdaProps } from './helpers';

const rootDir = path.join(__dirname, '../../');
const lambdaPath = path.join(rootDir, 'services', 'upload', 'handlers');

export class UploadStack extends Stack {
    public readonly uploadBucket: Bucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // ─── S3 Bucket ──────────────────────────────────────────────────────────
        this.uploadBucket = new Bucket(this, 'UploadBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
            cors: [
                {
                    allowedMethods: [
                        HttpMethods.GET,
                        HttpMethods.PUT,
                        HttpMethods.POST,
                        HttpMethods.HEAD,
                    ],
                    allowedOrigins: ['http://localhost:3000'],
                    allowedHeaders: ['*'],
                    exposedHeaders: ['ETag'],
                },
            ],
        });

        // Allow public read access (UUID-based keys make URLs unguessable)
        this.uploadBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new StarPrincipal()],
                actions: ['s3:GetObject'],
                resources: [this.uploadBucket.arnForObjects('*')],
            }),
        );

        // ─── Cognito values from UsersStack exports ─────────────────────────────

        const cognitoUserPoolId = Fn.importValue('UserPoolId');
        const cognitoClientId = Fn.importValue('UserPoolClientId');

        // ─── Lambdas ────────────────────────────────────────────────────────────

        const presignHandler = new NodejsFunction(this, 'PresignHandler', {
            ...commonLambdaProps,
            functionName: 'PresignHandler',
            entry: path.join(lambdaPath, 'presign.ts'),
            environment: {
                UPLOAD_BUCKET_NAME: this.uploadBucket.bucketName,
                COGNITO_USER_POOL_ID: cognitoUserPoolId,
                COGNITO_CLIENT_ID: cognitoClientId,
            },
        });

        const deleteUploadHandler = new NodejsFunction(
            this,
            'DeleteUploadHandler',
            {
                ...commonLambdaProps,
                functionName: 'DeleteUploadHandler',
                entry: path.join(lambdaPath, 'delete.ts'),
                environment: {
                    UPLOAD_BUCKET_NAME: this.uploadBucket.bucketName,
                    COGNITO_USER_POOL_ID: cognitoUserPoolId,
                    COGNITO_CLIENT_ID: cognitoClientId,
                },
            },
        );

        // ─── S3 Permissions ─────────────────────────────────────────────────────

        const s3PutPolicy = new PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [this.uploadBucket.arnForObjects('*')],
        });
        presignHandler.addToRolePolicy(s3PutPolicy);

        const s3DeletePolicy = new PolicyStatement({
            actions: ['s3:DeleteObject'],
            resources: [this.uploadBucket.arnForObjects('*')],
        });
        deleteUploadHandler.addToRolePolicy(s3DeletePolicy);

        // ─── API Gateway ────────────────────────────────────────────────────────

        const api = new RestApi(this, 'UploadApi', {
            restApiName: 'UploadApi',
            description: 'Upload API',
        });

        const uploadEndpoint = api.root.addResource('upload', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowCredentials: true,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
        });

        const presignEndpoint = uploadEndpoint.addResource('presign');
        const deleteEndpoint = uploadEndpoint.addResource('{key}');

        presignEndpoint.addMethod(
            'POST',
            new LambdaIntegration(presignHandler),
        );

        deleteEndpoint.addMethod(
            'DELETE',
            new LambdaIntegration(deleteUploadHandler),
        );

        // ─── Outputs ────────────────────────────────────────────────────────────

        new CfnOutput(this, 'UploadBucketName', {
            value: this.uploadBucket.bucketName,
            exportName: 'UploadBucketName',
        });

        new CfnOutput(this, 'UploadApiEndpoint', {
            value: api.url,
            exportName: 'UploadApi',
        });
    }
}
