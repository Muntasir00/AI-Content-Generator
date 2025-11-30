import axiosInstance from '../utils/axios';
import { endpoints } from '../utils/axios';

export interface GeneratePayload {
  prompt: string;
  type: string;
}

export const generateContent = async (data: GeneratePayload) => {
  const res = await axiosInstance.post(endpoints.content.generate, data);
  return res.data;
};

export const getContentStatus = async (jobId: string) => {
  const res = await axiosInstance.get(endpoints.content.status(jobId));
  return res.data;
};
