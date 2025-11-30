import axios, { endpoints } from 'app/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  username: string;
};

export type ChangePasswordParams = {
  newPassword: string;
  confirmPassword: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signIn = async ({ email, password }: SignInParams) => {
  const res = await axios.post(endpoints.auth.signIn, { email, password });
  const { accessToken, user } = res.data;

  if (!accessToken) throw new Error('Access token not found');
  await setSession(accessToken);

  return res.data;
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  username,
}: SignUpParams): Promise<boolean> => {
  const params = { email, password, username };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    // consider success when status is 200 or 201
    if (res?.status === 200 || res?.status === 201) {
      return true;
    }

    // if API returns success flag inside body, check it as a fallback
    if (res?.data?.success) {
      return true;
    }

    // Otherwise treat as error and surface message if any
    const message = res?.data?.message ?? 'Unexpected signup response';
    throw new Error(message);
  } catch (err) {
    // Normalize different shapes of errors into an Error instance with message
    let message = 'Something went wrong!';
    if (err instanceof Error) {
      message = err.message;
    } else if (err && typeof err === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = err as any;
      if (anyErr.message) message = anyErr.message;
      else if (anyErr.data?.message) message = anyErr.data.message;
      else message = JSON.stringify(anyErr);
    } else {
      message = String(err);
    }

    throw new Error(message);
  }
};

/** **************************************
 * ChangePassword
 *************************************** */
export const changePassword = async ({
  email,
  newPassword,
  confirmPassword,
}: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<boolean> => {
  try {
    const url = endpoints.auth.changePassword.replace(':email', email);

    const res = await axios.post(url, {
      newPassword,
      confirmPassword,
    });

    if (res?.data?.success || res.status === 200 || res.status === 201) {
      return true;
    }

    throw new Error(res?.data?.message ?? 'Password change failed');
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Something went wrong!';
    throw new Error(message);
  }
};

/** **************************************
 * forgot Password
 *************************************** */
export const forgotPassword = async ({
  email,
}: ForgotPasswordParams): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  try {
    const res = await axios.post(endpoints.auth.forgotPassword, {
      email,
    });

    const body = res?.data ?? res;

    return {
      success: !!body.success,
      message: body.message ?? '',
      data: body.data ?? null,
    };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Something went wrong';
    console.error('forgotPassword error', err);
    return { success: false, message };
  }
};

/** **************************************
 * verify Otp
 *************************************** */

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const url = endpoints.auth.verifyOtp.replace(':email', email);

    const res = await axios.post(url, { otp });

    return {
      success: !!res?.data?.success,
      message: res?.data?.message ?? 'OTP verified successfully!',
      data: res?.data,
    };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Something went wrong!';

    return { success: false, message };
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await axios.post(endpoints.auth.logout);
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out (server call):', error);

    try {
      await setSession(null);
    } catch (err) {
      console.error('Error clearing session after failed logout:', err);
    }
  }
};
