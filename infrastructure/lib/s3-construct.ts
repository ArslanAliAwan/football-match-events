import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { config } from './config';

interface RawEventsBucketConfig {
  bucketName?: string;
  objectExpirationDays?: number;
  infrequentAccessTransitionDays?: number;
}

export function createRawEventsBucket(
  scope: Construct,
  bucketConfig?: RawEventsBucketConfig
): s3.Bucket {
  return new s3.Bucket(scope, 'RawMatchEventsBucket', {
    bucketName: bucketConfig?.bucketName,
    versioned: true,
    encryption: s3.BucketEncryption.S3_MANAGED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    lifecycleRules: [
      {
        expiration: cdk.Duration.days(bucketConfig?.objectExpirationDays || config.s3.objectExpirationDays),
        transitions: [
          {
            storageClass: s3.StorageClass.INFREQUENT_ACCESS,
            transitionAfter: cdk.Duration.days(
              bucketConfig?.infrequentAccessTransitionDays || config.s3.infrequentAccessTransitionDays
            )
          }
        ]
      }
    ]
  });
}
