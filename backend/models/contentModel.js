import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    jobId: { type: String, required: true },
    prompt: String,
    type: String,
    generatedContent: String,
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Content', ContentSchema);
