import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const rootDir = path.join(__dirname, '../../');
export const commonLambdaProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_20_X,
    projectRoot: rootDir,
    depsLockFilePath: path.join(rootDir, 'pnpm-lock.yaml'),
    bundling: {
        externalModules: ['aws-sdk'],
        minify: false,
    },
};
