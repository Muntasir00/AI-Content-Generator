import Content from '../models/contentModel.js';
import { contentQueue } from '../queue.js';
import { v4 as uuidv4 } from 'uuid';

export const generateContent = async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (!prompt || !type) {
      return res
        .status(400)
        .json({ success: false, message: 'prompt and type are required' });
    }

    const jobId = uuidv4();

    const created = await Content.create({
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

    return res.status(202).json({
      success: true,
      id: created._id,
      message: 'Job queued!',
      jobId,
      delay: '60 seconds',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listContents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.mine === 'true') filter.userId = req.userId;
    if (req.query.type) filter.type = req.query.type;

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);
    if (!content)
      return res
        .status(404)
        .json({ success: false, message: 'Content not found' });

    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const content = await Content.findOne({ jobId });
    if (!content)
      return res
        .status(404)
        .json({ success: false, message: 'Content not found' });

    return res.status(200).json({
      success: true,
      data: {
        _id: content._id,
        status: content.status,
        generatedContent: content.generatedContent || null,
        jobId: content.jobId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content)
      return res
        .status(404)
        .json({ success: false, message: 'Content not found' });

    if (String(content.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await Content.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: 'Content deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
