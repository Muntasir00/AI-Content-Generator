// auth/provider.tsx
import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'app/hooks/use-set-state';

import axios, { endpoints } from 'app/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from './auth-context';
import { setSession, isValidToken, jwtDecode } from './utils'; // ensure jwtDecode exported

import type { AuthState } from '../types';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        // ensure axios header is set and sessionStorage is consistent
        await setSession(accessToken);

        // No /me endpoint — decode token to create a minimal user object
        try {
          const decoded = jwtDecode(accessToken) as any;
          // decoded should include things like id, email, role, exp, etc.
          const minimalUser = {
            id: decoded?.id ?? decoded?._id ?? null,
            email: decoded?.email ?? null,
            // add any property you store in token: username, role, etc.
            // NOTE: this is only minimal local user, not validated server-side
            accessToken,
          };

          setState({ user: minimalUser as any, loading: false });
        } catch (err) {
          // if decoding fails, clear user
          console.error('jwt decode failed', err);
          setState({ user: null, loading: false });
        }
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  // initSession: called after successful signIn to set full user & token
  const initSession = useCallback(
    (userData: any, accessToken: string) => {
      try {
        // persist token & axios header
        sessionStorage.setItem(STORAGE_KEY, accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // set full user from sign-in response
        setState({ user: { ...userData, accessToken }, loading: false });
      } catch (err) {
        console.error('initSession error', err);
      }
    },
    [setState]
  );

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user } : null,
      checkUserSession,
      initSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status, initSession]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
