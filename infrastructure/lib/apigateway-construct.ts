import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { config } from './config';

export function createApiGateway(
  scope: Construct, 
  ingestionLambda: lambda.Function,
  processingLambda: lambda.Function,
  queryLambda: lambda.Function,
  props: {
    apiName: string,
    stageName: string
  }
): apigateway.RestApi {
  const api = new apigateway.RestApi(scope, props.apiName, {
    restApiName: props.apiName,
    description: 'API for managing match events, ingestion, and processing',
    deployOptions: {
      stageName: props.stageName,
      metricsEnabled: config.apiGateway.metricsEnabled,
      loggingLevel: config.apiGateway.loggingLevel,
    },
  });

  // Lambda integrations for all Lambdas
  const queryIntegration = new apigateway.LambdaIntegration(queryLambda);
  const ingestionIntegration = new apigateway.LambdaIntegration(ingestionLambda);
  const processingIntegration = new apigateway.LambdaIntegration(processingLambda);

  // Match-related routes (for queryLambda)
  const matchesResource = api.root.addResource('matches');
  const matchIdResource = matchesResource.addResource('{match_id}');
  
  const matchGoalsResource = matchIdResource.addResource('goals');
  matchGoalsResource.addMethod('GET', queryIntegration);  // GET method for match goals

  const matchPassesResource = matchIdResource.addResource('passes');
  matchPassesResource.addMethod('GET', queryIntegration);  // GET method for match passes

  // Ingestion-related routes (for ingestionLambda)
  const ingestionResource = api.root.addResource('ingestion');
  ingestionResource.addMethod('POST', ingestionIntegration);  // POST method for ingestion

  // Processing-related routes (for processingLambda)
  const processingResource = api.root.addResource('processing');
  processingResource.addMethod('POST', processingIntegration);  // POST method for processing

  return api;
}
