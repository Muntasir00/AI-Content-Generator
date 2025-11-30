import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'app/routes/paths';
import { useRouter } from 'app/routes/hooks';
import { RouterLink } from 'app/routes/components';

import { useBoolean } from 'app/hooks/use-boolean';

import { Form } from 'app/components/hook-form';

import { useAuthContext } from 'app/auth/hooks';
import { signIn } from 'app/auth/context';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const { checkUserSession, initSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    try {
      setErrorMsg('');
      const dataRes = await signIn({
        email: data.email,
        password: data.password,
      });

      initSession?.(dataRes.user, dataRes.accessToken);
      router.push(paths.dashboard.root);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong!';

      setErrorMsg(errMsg);
    }
  });

  const renderForm = (
    <div className='flex justify-center items-center h-screen bg-green-50 px-4'>
      <div className='flex items-stretch w-full max-w-4xl h-[560px] bg-white p-4 gap-5'>
        {/* Left side (Image) */}
        <div className='flex-1 h-full'>
          <img
            src='/image/login-img.png'
            alt='login'
            className='w-full h-full object-cover rounded'
          />
        </div>

        {/* Right side (Card) */}
        <Card className='flex-1 '>
          <CardHeader>
            <CardTitle>Let's Get Started</CardTitle>
            <CardDescription>
              Hi! Please enter your login information below to access the panel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='mb-1'>
                  Enter Email
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Email'
                    {...register('email')}
                    className='w-full'
                  />
                </div>
                {errors.email?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.email.message)}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password' className='mb-1'>
                  Password
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Password'
                    {...register('password')}
                    className='w-full'
                  />
                </div>
                {errors.password?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.password.message)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <a
              className='w-full text-center bg-green-20 border rounded-2xl p-2'
              href={paths.auth.jwt.forgotPassword}
            >
              Forgot Password
            </a>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? 'Submitting…' : 'Login'}
            </Button>
            <p>
              Don't have a account?{' '}
              <a href={paths.auth.jwt.signUp} className='text-green-500'>
                SignUp
              </a>
            </p>

            {errorMsg ? (
              <p className='text-sm text-destructive'>{errorMsg}</p>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {/* Error alert */}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
