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

export const ChangePasswordInSchema = zod.object({
  newPassword: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  confirmPassword: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function PasswordChangeView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

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
      await changePassword({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      await checkUserSession?.();

      // refresh or navigate as needed
      router.refresh();
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
      {/* Error alert */}
      {errorMsg ? (
        <Alert className='mb-4'>
          <div className='flex items-start gap-3'>
            <AlertCircleIcon className='h-5 w-5' />
            <div>
              <AlertTitle className='font-medium'>
                Unable to process your request.
              </AlertTitle>
              <AlertDescription>
                <p className='text-sm'>{errorMsg}</p>
                <p className='text-sm'>Please check your Password</p>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
