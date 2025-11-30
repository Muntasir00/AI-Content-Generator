import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  db: 0,
});

export const contentQueue = new Queue('contentQueue', {
  connection,
});
