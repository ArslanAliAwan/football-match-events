export function getTableName(): string {
    const tableName = process.env.DYNAMODB_TABLE;
    if (!tableName) {
      throw new Error('DYNAMODB_TABLE environment variable not set');
    }
    return tableName;
  }