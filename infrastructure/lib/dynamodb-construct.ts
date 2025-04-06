import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// Update this function to accept props, so you can pass additional configuration
export function createDynamoDBTable(
  scope: Construct,
  props: { 
    tableName: string;
    partitionKeyName: string;
    sortKeyName?: string;
  }
): dynamodb.Table {
  return new dynamodb.Table(scope, props.tableName, {
    tableName: props.tableName,
    partitionKey: { 
      name: props.partitionKeyName, 
      type: dynamodb.AttributeType.STRING 
    },
    sortKey: props.sortKeyName ? { 
      name: props.sortKeyName, 
      type: dynamodb.AttributeType.STRING 
    } : undefined,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    timeToLiveAttribute: 'ttl',
    pointInTimeRecovery: true,
  });
}
