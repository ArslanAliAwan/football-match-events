import { EventBridgeEvent } from 'aws-lambda';
import { processGoalEvent } from './eventProcessors/goalProcessor';
import { processPassEvent } from './eventProcessors/passProcessor';
import { MatchEvent } from './types/match-events';


export const handler = async (event: EventBridgeEvent<string, MatchEvent>) => {
  try {
    // Validate input event
    if (!event.detail) {
      console.warn('Invalid event: No detail found');
      return;
    }

    const matchEvent = event.detail;

    // Process different event types
    switch (matchEvent.type) {
      case 'GOAL_SCORED':
        await processGoalEvent(matchEvent);
        break;
      case 'PASS_COMPLETED':
        await processPassEvent(matchEvent);
        break;
      default:
        console.warn(`Unhandled event type: ${matchEvent.type}`);
    }
  } catch (error) {
    console.error('Error processing event:', error);
  }
};