export function getDefaultQuery(tableName: string, matchId: string) {
    return {
      TableName: tableName,
      KeyConditionExpression: 'match_id = :matchId',
      ExpressionAttributeValues: {
        ':matchId': matchId
      }
    };
  }
  
  export function getQueryWithEventType(tableName: string, matchId: string, eventType: string) {
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
  