import { create } from 'zustand';
import { generateContent, getContentStatus } from './contentService';

interface ContentState {
  jobId: string | null;
  generatedContent: string | null;
  status: string | null;
  loading: boolean;
  error: string | null;

  generate: (prompt: string, type: string) => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  jobId: null,
  generatedContent: null,
  status: null,
  loading: false,
  error: null,

  generate: async (prompt, type) => {
    set({ loading: true, error: null });

    try {
      const res = await generateContent({ prompt, type });
      set({ jobId: res.jobId, status: 'queued', loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  checkStatus: async () => {
    const jobId = get().jobId;
    if (!jobId) return;

    try {
      const res = await getContentStatus(jobId);
      set({ status: res.status });

      if (res.status === 'completed') {
        set({ generatedContent: res.generatedContent });
      }
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
