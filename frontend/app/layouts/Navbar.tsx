import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { signOut } from 'app/auth/context/action';
import { useRouter } from 'app/routes/hooks';
import { paths } from 'app/routes/paths';
import { useAuthContext } from 'app/auth/hooks';

const Navbar = () => {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      // full page redirect to avoid SSR/routing races
      window.location.href = paths.auth.jwt.signIn;
    } catch (err) {
      console.error('Sign out failed', err);
      window.location.href = paths.auth.jwt.signIn;
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200'>
      <div className='max-w-[1920px] mx-auto flex justify-between items-center px-6 py-3'>
        <div className='flex gap-3 items-center justify-center'>
          <img
            src='/image/ai_content_generator.png'
            alt=''
            className='w-12 h-12'
          />
          <h1>AI-Powered Content Generator &amp; Management System</h1>
        </div>

        <div>
          {loading ? null : authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src='https://github.com/shadcn.png'
                    alt='User'
                    className='w-12'
                  />
                  <AvatarFallback>ACC</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex gap-2'>
              <button
                onClick={() => router.push(paths.auth.jwt.signIn)}
                className='px-3 py-1 rounded-md text-sm border'
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(paths.auth.jwt.signUp)}
                className='px-3 py-1 rounded-md text-sm bg-green-500 text-white'
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
