// store/contentStore.ts
import { create } from 'zustand';
import {
  generateContent,
  getContentStatus,
  listContents,
  getContentById,
  deleteContent,
} from './contentService';

interface ContentItem {
  _id: string;
  jobId: string;
  prompt: string;
  type: string;
  status: string;
  generatedContent?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentState {
  jobId: string | null;
  generatedContent: string | null;
  status: string | null;
  loading: boolean;
  error: string | null;

  // list view
  items: ContentItem[];
  selectedItem: ContentItem | null;
  listLoading: boolean;

  generate: (prompt: string, type: string) => Promise<void>;
  checkStatus: () => Promise<void>;

  fetchList: () => Promise<void>;
  fetchItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  jobId: null,
  generatedContent: null,
  status: null,
  loading: false,
  error: null,

  items: [],
  selectedItem: null,
  listLoading: false,

  generate: async (prompt, type) => {
    set({
      loading: true,
      error: null,
      generatedContent: null,
      status: 'queued',
    });
    try {
      const res = await generateContent({ prompt, type });
      // backend may return { jobId } inside data or directly
      const jobId = (res && (res.jobId ?? res.job_id ?? null)) || null;
      // if generate endpoint returned saved object with jobId inside data
      set({ jobId, status: 'queued', loading: false });
      // refresh list after starting job
      get()
        .fetchList()
        .catch(() => {});
    } catch (e: any) {
      const message = e?.message ?? (e?.toString && e.toString()) ?? 'Failed';
      set({ error: message, loading: false, status: null });
    }
  },

  checkStatus: async () => {
    const jobId = get().jobId;
    if (!jobId) return;
    try {
      const res = await getContentStatus(jobId);
      const status = (res && res.status) ?? null;
      set({ status });
      if (status === 'completed') {
        set({
          generatedContent:
            res.generatedContent ?? res.generated_content ?? null,
        });
        get()
          .fetchList()
          .catch(() => {});
      }
    } catch (e: any) {
      const message = e?.message ?? 'Failed to check status';
      set({ error: message });
    }
  },

  fetchList: async () => {
    set({ listLoading: true, error: null });
    try {
      const res = await listContents();
      const items = Array.isArray(res) ? res : (res.data ?? res);
      set({ items, listLoading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to load list', listLoading: false });
    }
  },

  fetchItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getContentById(id);
      set({ selectedItem: res as ContentItem, loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to load item', loading: false });
    }
  },

  removeItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteContent(id);

      set(state => ({
        items: state.items.filter(i => i._id !== id),
        loading: false,
      }));
      if (get().selectedItem?._id === id) set({ selectedItem: null });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to delete', loading: false });
    }
  },

  clearSelected: () => set({ selectedItem: null }),
}));
