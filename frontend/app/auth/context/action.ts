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
  newPassword,
  confirmPassword,
}: ChangePasswordParams): Promise<void> => {
  try {
    const params = { newPassword, confirmPassword };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign in
 *************************************** */
export const forgotPassword = async ({
  email,
}: ForgotPasswordParams): Promise<{ success: boolean; message: string }> => {
  try {
    const params = { email };
    const res = await axios.post(endpoints.auth.forgotPassword, params);

    return res.data;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
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
