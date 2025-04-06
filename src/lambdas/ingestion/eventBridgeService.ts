import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { MatchEvent } from './types/match-events';
// Initialize EventBridge client
const eventBridgeClient = new EventBridgeClient({});


export async function putEventToEventBridge(matchEvent: MatchEvent, eventId: string) {
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