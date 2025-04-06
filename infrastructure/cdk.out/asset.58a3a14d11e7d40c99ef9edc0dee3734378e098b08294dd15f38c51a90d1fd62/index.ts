import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const dynamoDBClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: any) => {
  try {
    // Validate input
    const matchId = event.pathParameters?.match_id;
    const eventType = event.queryStringParameters?.type;

    if (!matchId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Match ID is required' })
      };
    }

    const tableName = process.env.DYNAMODB_TABLE;
    if (!tableName) {
      throw new Error('DYNAMODB_TABLE environment variable not set');
    }

    // Construct query based on event type
    const queryParams = eventType 
      ? getQueryWithEventType(tableName, matchId, eventType)
      : getDefaultQuery(tableName, matchId);

    // Execute query
    const queryCommand = new QueryCommand(queryParams);
    const result = await dynamoDBClient.send(queryCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        events: result.Items || [],
        count: result.Count || 0
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error querying events:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error querying events', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
};

function getDefaultQuery(tableName: string, matchId: string) {
  return {
    TableName: tableName,
    KeyConditionExpression: 'match_id = :matchId',
    ExpressionAttributeValues: {
      ':matchId': matchId
    }
  };
}

function getQueryWithEventType(tableName: string, matchId: string, eventType: string) {
  return {
    TableName: tableName,
    KeyConditionExpression: 'match_id = :matchId',
    FilterExpression: 'event_type = :eventType',
    ExpressionAttributeValues: {
      ':matchId': matchId,
      ':eventType': eventType.toUpperCase()
    }
  };
}