#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FootballMatchEventsStack } from '../lib';

const app = new cdk.App();

// Setting environment variables from centralized config
new FootballMatchEventsStack(app, 'FootballMatchEventsStack', {
  env: {
    account: '000000000000', // LocalStack default account
    region: 'eu-central-1'   // specified region
  }
});
