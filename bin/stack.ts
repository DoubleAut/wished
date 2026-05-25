#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';

import 'source-map-support/register';
import { AuthorizationStack } from './stacks/authorization';
import { UploadStack } from './stacks/upload';
import { UsersStack } from './stacks/users';
import { WishesStack } from './stacks/wished';

const app = new cdk.App();

const uploadStack = new UploadStack(app, 'UploadStack');
new WishesStack(app, 'WishesStack', {
    uploadBucket: uploadStack.uploadBucket,
});
new UsersStack(app, 'UsersStack');
new AuthorizationStack(app, 'AuthorizationStack');
