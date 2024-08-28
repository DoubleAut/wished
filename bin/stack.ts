#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AuthorizationStack } from './stacks/authorization';
import { UsersStack } from './stacks/users';
import { WishesStack } from './stacks/wished';

const app = new cdk.App();

new WishesStack(app, 'WishesStack');
new UsersStack(app, 'UsersStack');
new AuthorizationStack(app, 'AuthorizationStack');
