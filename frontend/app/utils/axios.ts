import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'app/config-global';
import { STORAGE_KEY } from 'app/auth/context/constant';
import { changePassword, forgotPassword } from '~/auth/context';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong!'
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

axiosInstance.interceptors.request.use(config => {
  try {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    signIn: '/user/login',
    signUp: '/user/register',
    verify: '/user/verify',
    forgotPassword: '/user/forgot-password',
    verifyOtp: '/user/verify-otp/:email',
    changePassword: '/user/change-password/:email',
    logout: '/user/logout',
  },
  content: {
    generate: '/app/generate',
    status: (jobId: string) => `/app/job/${jobId}`,
  },
};
