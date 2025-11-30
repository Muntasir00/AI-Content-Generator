import { useEffect, useState } from 'react';
import axios, { endpoints } from 'app/utils/axios';
import { useParams } from 'app/routes/hooks';
import { paths } from '~/routes/paths';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          endpoints.auth.verify,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center min-h-screen text-xl font-semibold'>
        Verifying your account...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-600 text-xl font-semibold'>
        Verification failed. Invalid or expired token.
      </div>
    );
  }

  return (
    <div className='font-bold text-3xl text-green-800 flex justify-center items-center min-h-screen'>
      <p className='text-center'>
        Account Verified Successfully <br />
        Back to{' '}
        <a href={paths.auth.jwt.signIn} className='text-green-300 underline'>
          Login
        </a>
      </p>
    </div>
  );
};

export default VerifyEmail;
