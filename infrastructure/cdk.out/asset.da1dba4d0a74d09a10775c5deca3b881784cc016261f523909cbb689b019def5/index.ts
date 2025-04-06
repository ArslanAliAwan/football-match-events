import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { EventBridgeEvent } from 'aws-lambda';

// Initialize DynamoDB client
const dynamoDBClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface MatchEvent {
  type: string;
  matchId: string;
  timestamp: string;
  data: any;
  eventId: string;
}

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

async function processGoalEvent(event: MatchEvent) {
  const tableName = process.env.DYNAMODB_TABLE;
  if (!tableName) {
    throw new Error('DYNAMODB_TABLE environment variable not set');
  }

  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      match_id: event.matchId,
      timestamp: event.timestamp,
      event_type: 'GOAL',
      event_id: event.eventId,
      details: event.data
    }
  });

  await dynamoDBClient.send(putCommand);
}

async function processPassEvent(event: MatchEvent) {
  const tableName = process.env.DYNAMODB_TABLE;
  if (!tableName) {
    throw new Error('DYNAMODB_TABLE environment variable not set');
  }

  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      match_id: event.matchId,
      timestamp: event.timestamp,
      event_type: 'PASS',
      event_id: event.eventId,
      details: event.data
    }
  });

  await dynamoDBClient.send(putCommand);
}