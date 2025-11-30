import type { changePassword } from '~/auth/context';
import { paramCase } from '../utils/change-case';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page404: '/error/404',

  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      forgotPassword: `${ROOTS.AUTH}/forgot-password`,
      verifyOtp: `${ROOTS.AUTH}/verify-otp`,
      verify_otp: `${ROOTS.AUTH}/verify-otp/:email`,
      changePassword: `${ROOTS.AUTH}/change-password`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
};
