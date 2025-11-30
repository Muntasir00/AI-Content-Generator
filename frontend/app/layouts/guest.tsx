// layouts/guest.tsx
import { Outlet } from 'react-router';
import { GuestGuard } from 'app/auth/guard';

export default function GuestLayout() {
  return (
    <GuestGuard>
      <div className='guest-shell'>
        <main>
          <Outlet />
        </main>
      </div>
    </GuestGuard>
  );
}
