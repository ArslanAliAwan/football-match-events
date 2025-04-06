import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { config } from './config'; // Import config file

// Import constructs
import { createDynamoDBTable } from './dynamodb-construct';
import { createEventBus } from './eventbridge-construct';
import { createRawEventsBucket } from './s3-construct';
import {
  createIngestionLambda,
  createProcessingLambda,
  createQueryLambda
} from './lambda-constructs';
import { createApiGateway } from './apigateway-construct';
import {
  createIngestionLambdaRole,
  createProcessingLambdaRole,
  createQueryLambdaRole
} from './iam-constructs';

export class FootballMatchEventsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use config variables instead of process.env
    const lambdaRuntime = lambda.Runtime.NODEJS_18_X;

    // Create raw events S3 bucket
    const rawEventsBucket = createRawEventsBucket(this, {
      bucketName: config.s3.bucketName, 
      objectExpirationDays: config.s3.objectExpirationDays, 
      infrequentAccessTransitionDays: config.s3.infrequentAccessTransitionDays
    });

    // Create DynamoDB table
    const matchEventsTable = createDynamoDBTable(this, {
      tableName: config.dynamoDB.tableName,
      partitionKeyName: config.dynamoDB.partitionKeyName,
      sortKeyName: config.dynamoDB.sortKeyName
    });

    // Create EventBridge event bus
    const eventBus = createEventBus(this, {
      eventBusName: config.eventBridge.eventBusName
    });

    // Create IAM Roles
    const ingestionLambdaRole = createIngestionLambdaRole(this, eventBus);
    const processingLambdaRole = createProcessingLambdaRole(this, matchEventsTable);
    const queryLambdaRole = createQueryLambdaRole(this, matchEventsTable);

    // Create Lambda Functions
    const ingestionLambda = createIngestionLambda(this, {
      role: ingestionLambdaRole,
      eventBusName: eventBus.eventBusName,
      rawEventsBucketName: rawEventsBucket.bucketName,
      lambdaName: config.lambda.ingestionLambdaName, 
      runtime: lambdaRuntime,
      timeout: config.lambda.timeout,
      memorySize: config.lambda.memorySize
    });

    const processingLambda = createProcessingLambda(this, {
      role: processingLambdaRole,
      dynamoDBTableName: matchEventsTable.tableName,
      lambdaName: config.lambda.processingLambdaName,
      runtime: lambdaRuntime,
      timeout: config.lambda.timeout,
      memorySize: config.lambda.memorySize
    });

    const queryLambda = createQueryLambda(this, {
      role: queryLambdaRole,
      dynamoDBTableName: matchEventsTable.tableName,
      lambdaName: config.lambda.queryLambdaName, 
      runtime: lambdaRuntime,
      timeout: config.lambda.timeout,
      memorySize: config.lambda.memorySize
    });

    // Create API Gateway
    const api = createApiGateway(this, queryLambda, {
      apiName: config.apiGateway.apiName,
      stageName: config.apiGateway.stageName
    });

    new cdk.CfnOutput(this, 'EventBusName', { value: eventBus.eventBusName });
    new cdk.CfnOutput(this, 'RawEventsBucketName', { value: rawEventsBucket.bucketName });
  }
}
