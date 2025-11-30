import { Outlet } from 'react-router';
import { AuthGuard } from 'app/auth/guard';

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <div className='app-shell'>
        <main>
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
