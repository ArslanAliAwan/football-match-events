import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

// Initialize AWS SDK clients
const eventBridgeClient = new EventBridgeClient({});
const s3Client = new S3Client({});

interface MatchEvent {
  type: string;
  matchId: string;
  timestamp: string;
  data: any;
}

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

async function storeRawEventInS3(matchEvent: MatchEvent, eventId: string) {
  const bucketName = process.env.RAW_EVENTS_BUCKET;
  if (!bucketName) {
    throw new Error('RAW_EVENTS_BUCKET environment variable not set');
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: `events/${matchEvent.matchId}/${eventId}.json`,
    Body: JSON.stringify(matchEvent),
    ContentType: 'application/json'
  });

  await s3Client.send(putObjectCommand);
}

async function putEventToEventBridge(matchEvent: MatchEvent, eventId: string) {
  const eventBusName = process.env.EVENT_BUS_NAME;
  if (!eventBusName) {
    throw new Error('EVENT_BUS_NAME environment variable not set');
  }

  const putEventsCommand = new PutEventsCommand({
    Entries: [
      {
        EventBusName: eventBusName,
        Source: 'football.match.events',
        DetailType: matchEvent.type,
        Detail: JSON.stringify({
          ...matchEvent,
          eventId: eventId
        })
      }
    ]
  });

  await eventBridgeClient.send(putEventsCommand);
}