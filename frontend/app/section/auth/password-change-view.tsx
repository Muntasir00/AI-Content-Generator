import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'app/routes/paths';
import { useRouter, useSearchParams } from 'app/routes/hooks';
import { RouterLink } from 'app/routes/components';

import { useBoolean } from 'app/hooks/use-boolean';

import { Form } from 'app/components/hook-form';

import { useAuthContext } from 'app/auth/hooks';
import { changePassword, signIn } from 'app/auth/context';
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

export type ChangePasswordInSchemaType = zod.infer<
  typeof ChangePasswordInSchema
>;

export const ChangePasswordInSchema = zod
  .object({
    newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function PasswordChangeView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues: ChangePasswordInSchemaType = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm<ChangePasswordInSchemaType>({
    resolver: zodResolver(ChangePasswordInSchema),
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

      if (!email) {
        throw new Error('Email is missing in URL');
      }

      await changePassword({
        email: email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      // Redirect to login page after success
      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : String(error));
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
            <CardTitle>Enter password and Confirm Password</CardTitle>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='mb-1'>
                  Password
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='newPassword'
                    type='password'
                    placeholder='New password'
                    {...register('newPassword')}
                    className='w-full'
                  />
                </div>
                {errors.newPassword?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.newPassword.message)}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password' className='mb-1'>
                  Confirm Password
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm Password'
                    {...register('confirmPassword')}
                    className='w-full'
                  />
                </div>
                {errors.confirmPassword?.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(errors.confirmPassword.message)}
                  </p>
                )}
              </div>
              {/* Error alert */}
              {errorMsg ? (
                <p className='text-sm text-destructive'>{errorMsg}</p>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? 'Submitting…' : 'Change Password'}
            </Button>
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
