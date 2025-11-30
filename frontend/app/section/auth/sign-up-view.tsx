import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'app/routes/paths';
import { useRouter } from 'app/routes/hooks';

import { Form } from 'app/components/hook-form';

import { signUp } from 'app/auth/context/action'; // updated action path
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';

// ----------------------------------------------------------------------
export const SignUpSchema = zod.object({
  username: zod.string().min(1, { message: 'Username is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

// ----------------------------------------------------------------------
export function SignUpView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues: SignUpSchemaType = {
    username: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
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

      const ok = await signUp({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (ok) {
        // navigate to sign-in page on successful signup
        router.push(paths.auth.jwt.signIn);
        return;
      }

      // fallback message if signUp returned false (shouldn't happen)
      setErrorMsg('Signup did not complete. Please try again.');
    } catch (err) {
      console.error('Signup error:', err);
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
    }
  });

  const renderForm = (
    <div className='flex justify-center items-center h-screen bg-green-50 px-4'>
      <div className='flex items-stretch w-full max-w-4xl h-[560px] bg-white p-4 gap-5'>
        <div className='flex-1 h-full'>
          <img
            src='/image/login-img.png'
            alt='login'
            className='w-full h-full object-cover rounded'
          />
        </div>

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
                <Label htmlFor='username' className='mb-1'>
                  Username
                </Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='Name'
                  {...register('username')}
                  className='w-full'
                />
                {errors.username?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.username.message)}
                  </p>
                )}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='email' className='mb-1'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  {...register('email')}
                  className='w-full'
                />
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
                <Input
                  id='password'
                  type='password'
                  placeholder='Password'
                  {...register('password')}
                  className='w-full'
                />
                {errors.password?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.password.message)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? 'Submitting…' : 'Register'}
            </Button>
            {errorMsg ? (
              <p className='text-sm text-destructive'>{errorMsg}</p>
            ) : null}
            <p>
              Back To LogIn?{' '}
              <a href={paths.auth.jwt.signIn} className='text-green-500'>
                SignIn
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
