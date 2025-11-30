import { Worker } from 'bullmq';
import axios from 'axios';
import connectDB from './database/db.js';
import Content from './models/contentModel.js';
import dotenv from 'dotenv';
dotenv.config();

import IORedis from 'ioredis';
await connectDB();
console.log(' MongoDB connected in Worker');

const connection = new IORedis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  db: 0,
});

const AI_API_KEY = process.env.OPENAI_API_KEY;

const worker = new Worker(
  'contentQueue',
  async job => {
    console.log(`Processing job with id: ${job.data.jobId}`);
    const { jobId, prompt, type } = job.data;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: `${type}: ${prompt}` }],
        },
        {
          headers: {
            Authorization: `Bearer ${AI_API_KEY}`,
          },
        }
      );

      console.log(response);

      const finalContent = response.data.choices[0].message.content;
      console.log(finalContent);

      await Content.findOneAndUpdate(
        { jobId },
        { generatedContent: finalContent, status: 'completed' },
        { new: true }
      );

      console.log(` Job ${jobId} completed!`);
    } catch (err) {
      await Content.findOneAndUpdate({ jobId }, { status: 'failed' });
      console.error(' Worker Error:', err.message);
    }
  },
  { connection }
);

console.log(' Worker started — Waiting for jobs...');
