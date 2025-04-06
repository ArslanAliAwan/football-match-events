import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as eventbridge from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { config } from './config';

export function createIngestionLambdaRole(
  scope: Construct, 
  eventBus: eventbridge.EventBus
): iam.Role {
  const role = new iam.Role(scope, config.iamRoles.ingestionLambdaRoleName, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    actions: ['events:PutEvents'],
    resources: [eventBus.eventBusArn],
  }));

  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
  );

  return role;
}

export function createProcessingLambdaRole(
  scope: Construct, 
  dynamoDBTable: dynamodb.Table
): iam.Role {
  const role = new iam.Role(scope, config.iamRoles.processingLambdaRoleName, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    actions: [
      'dynamodb:PutItem', 
      'dynamodb:UpdateItem', 
      'dynamodb:BatchWriteItem'
    ],
    resources: [dynamoDBTable.tableArn],
  }));

  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
  );

  return role;
}

export function createQueryLambdaRole(
  scope: Construct, 
  dynamoDBTable: dynamodb.Table
): iam.Role {
  const role = new iam.Role(scope, config.iamRoles.queryLambdaRoleName, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    actions: [
      'dynamodb:Query', 
      'dynamodb:GetItem',
      'dynamodb:Scan'
    ],
    resources: [dynamoDBTable.tableArn],
  }));

  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
  );

  return role;
}
