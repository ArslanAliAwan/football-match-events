import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export const config = {
  aws: {
    accountId: 'your-default-account-id',
    region: 'us-east-1',
  },
  apiGateway: {
    apiName: process.env.API_GATEWAY_NAME || 'MatchEventsApi',
    stageName: process.env.API_STAGE_NAME || 'prod',
    loggingLevel: apigateway.MethodLoggingLevel.INFO,
    metricsEnabled: true,
  },
  dynamoDB: {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'MatchEventsTable',
    partitionKeyName: process.env.DYNAMODB_PARTITION_KEY || 'match_id',
    sortKeyName: process.env.DYNAMODB_SORT_KEY || undefined,
  },
  eventBridge: {
    eventBusName: process.env.EVENT_BUS_NAME || 'football-match-events-bus',
  },
  iamRoles: {
    ingestionLambdaRoleName: process.env.INGESTION_LAMBDA_ROLE_NAME || 'IngestionLambdaRole',
    processingLambdaRoleName: process.env.PROCESSING_LAMBDA_ROLE_NAME || 'ProcessingLambdaRole',
    queryLambdaRoleName: process.env.QUERY_LAMBDA_ROLE_NAME || 'QueryLambdaRole',
  },
  lambda: {
    ingestionLambdaName: 'IngestionLambda',
    processingLambdaName: 'ProcessingLambda',
    queryLambdaName: 'QueryLambda',
    runtime: 'NODEJS_18_X',
    timeout: 60,
    memorySize: 1024
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME || 'default-s3-bucket',
    objectExpirationDays: 30, // Default expiration in days
    infrequentAccessTransitionDays: 15, // Default infrequent access transition days
  },
};