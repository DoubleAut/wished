#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AuthorizationStack } from './stacks/authorization';
import { UsersStack } from './stacks/users';
import { WishesStack } from './stacks/wished';

const app = new cdk.App();
const suffix = app.node.tryGetContext('suffix') || '';

new WishesStack(app, `WishesStack${suffix}`, { suffix });
new UsersStack(app, `UsersStack${suffix}`, { suffix });
new AuthorizationStack(app, `AuthorizationStack${suffix}`, { suffix });
