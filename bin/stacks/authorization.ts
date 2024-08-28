import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';
import { commonLambdaProps } from './helpers';

const rootDir = path.join(__dirname, '../../');
const lambdaPath = path.join(rootDir, 'services', 'users');

export class AuthorizationStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const authorizationHandler = new NodejsFunction(
            this,
            'AuthorizationHandler',
            {
                ...commonLambdaProps,
                functionName: 'AuthorizationHandler',
                entry: path.join(lambdaPath, 'authorizeRequest.ts'),
            },
        );

        new CfnOutput(this, 'TokenAuthorizerArn', {
            value: authorizationHandler.functionArn,
            exportName: 'TokenAuthorizerArn',
        });
    }
}
