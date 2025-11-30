// pages/index.tsx
import { useEffect } from 'react';
import { useAuthContext } from 'app/auth/hooks';
import { useRouter } from 'app/routes/hooks';
import { paths } from 'app/routes/paths';

export default function IndexRedirect() {
  const { authenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (authenticated) {
      router.replace(paths.dashboard.root);
    } else {
      router.replace(paths.auth.jwt.signIn);
    }
  }, [authenticated, loading, router]);

  return null;
}
