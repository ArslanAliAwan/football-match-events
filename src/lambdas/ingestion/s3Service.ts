import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({});

import { MatchEvent } from './types/match-events';

export async function storeRawEventInS3(matchEvent: MatchEvent, eventId: string) {
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