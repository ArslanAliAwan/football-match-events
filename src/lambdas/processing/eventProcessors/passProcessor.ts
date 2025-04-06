import { PutCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDBClient from '../dbClient';
import { MatchEvent } from '../types/match-events';
import { getTableName } from '../utils';

export async function processPassEvent(event: MatchEvent) {
  const tableName = getTableName();

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