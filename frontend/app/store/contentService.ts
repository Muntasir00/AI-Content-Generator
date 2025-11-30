import axiosInstance from '../utils/axios';
import type { AxiosResponse } from 'axios';

export interface GeneratePayload {
  prompt: string;
  type: string;
}

const unwrap = <T = any>(res: AxiosResponse) => {
  if (res && (res as any).data) {
    const body = (res as any).data;
    return body.data ?? body;
  }
  return res;
};

export const generateContent = async (data: GeneratePayload) => {
  const res = await axiosInstance.post('/app/generate', data);
  return unwrap(res);
};

export const getContentStatus = async (jobId: string) => {
  const res = await axiosInstance.get(`/app/job/${jobId}`);
  return unwrap(res);
};

export const listContents = async () => {
  const res = await axiosInstance.get('/app');
  return unwrap(res);
};

export const getContentById = async (id: string) => {
  const res = await axiosInstance.get(`/app/id/${id}`);
  return unwrap(res);
};

export const deleteContent = async (id: string) => {
  const res = await axiosInstance.delete(`/app/id/${id}`);
  return unwrap(res);
};
