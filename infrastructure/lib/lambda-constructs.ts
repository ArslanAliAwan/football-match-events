import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';
import { config } from './config';

interface LambdaConfig {
  role: iam.Role;
  eventBusName?: string;
  rawEventsBucketName?: string;
  dynamoDBTableName?: string;
  lambdaName?: string;
  runtime?: lambda.Runtime;
  timeout?: number;
  memorySize?: number;
  ingestionLambdaName?: string; 
  processingLambdaName?: string; 
  queryLambdaName?: string; 
}


export function createIngestionLambda(
  scope: Construct, 
  lambdaConfig: LambdaConfig
): lambda.Function {
  return new lambda.Function(scope, lambdaConfig.lambdaName || 'IngestionLambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, '../../src/lambdas/ingestion')),
    role: lambdaConfig.role,
    environment: {
      EVENT_BUS_NAME: lambdaConfig.eventBusName || '',
      RAW_EVENTS_BUCKET: lambdaConfig.rawEventsBucketName || '',
    },
    timeout: cdk.Duration.seconds(lambdaConfig.timeout || config.lambda.timeout),
    memorySize: lambdaConfig.memorySize || config.lambda.memorySize,
  });
}

export function createProcessingLambda(
  scope: Construct, 
  lambdaConfig: LambdaConfig
): lambda.Function {
  return new lambda.Function(scope, lambdaConfig.lambdaName || 'ProcessingLambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, '../../src/lambdas/processing')),
    role: lambdaConfig.role,
    environment: {
      DYNAMODB_TABLE: lambdaConfig.dynamoDBTableName || '',
    },
    timeout: cdk.Duration.seconds(lambdaConfig.timeout || config.lambda.timeout),
    memorySize: lambdaConfig.memorySize || config.lambda.memorySize,
  });
}

export function createQueryLambda(
  scope: Construct, 
  lambdaConfig: LambdaConfig
): lambda.Function {
  return new lambda.Function(scope, lambdaConfig.lambdaName || 'QueryLambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, '../../src/lambdas/query')),
    role: lambdaConfig.role,
    environment: {
      DYNAMODB_TABLE: lambdaConfig.dynamoDBTableName || '',
    },
    timeout: cdk.Duration.seconds(lambdaConfig.timeout || config.lambda.timeout),
    memorySize: lambdaConfig.memorySize || config.lambda.memorySize,
  });
}
