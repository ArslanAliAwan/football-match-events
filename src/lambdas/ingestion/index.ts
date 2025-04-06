import { v4 as uuidv4 } from 'uuid';
import { storeRawEventInS3 } from './s3Service';
import { putEventToEventBridge } from './eventBridgeService';
import { MatchEvent } from './types/match-events';

export const handler = async (event: any) => {
  try {
    // Validate input event
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input: No event body' })
      };
    }

    // Parse the incoming event
    const matchEvent: MatchEvent = JSON.parse(event.body);

    // Generate unique event ID
    const eventId = uuidv4();

    // Store raw event in S3
    await storeRawEventInS3(matchEvent, eventId);

    // Put event to EventBridge
    await putEventToEventBridge(matchEvent, eventId);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Event processed successfully', 
        eventId: eventId 
      })
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error processing event', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
};

