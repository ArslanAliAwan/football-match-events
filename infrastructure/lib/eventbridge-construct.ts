import * as eventbridge from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export function createEventBus(scope: Construct, props: { eventBusName: string }): eventbridge.EventBus {
  return new eventbridge.EventBus(scope, 'MatchEventsEventBus', {
    eventBusName: props.eventBusName,
  });
}
