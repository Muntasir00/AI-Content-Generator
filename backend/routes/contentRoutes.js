import express from 'express';
import { contentQueue } from '../queue.js';
import Content from '../models/contentModel.js';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/generate', isAuthenticated, async (req, res) => {
  const { prompt, type } = req.body;
  const jobId = uuidv4();

  await Content.create({
    userId: req.userId,
    jobId,
    prompt,
    type,
    status: 'queued',
  });

  await contentQueue.add(
    'generateJob',
    { jobId, prompt, type, userId: req.userId },
    { delay: 60000 }
  );

  res.status(202).json({
    message: 'Job queued!',
    jobId,
    delay: '60 seconds',
  });
});

router.get('/status/:jobId', isAuthenticated, async (req, res) => {
  const { jobId } = req.params;

  const content = await Content.findOne({ jobId });
  if (!content) return res.status(404).json({ status: 'not_found' });

  res.json({
    status: content.status,
    generatedContent: content.generatedContent || null,
  });
});

export default router;
