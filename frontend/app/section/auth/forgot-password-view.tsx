import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'app/routes/paths';
import { useRouter } from 'app/routes/hooks';

import { Form } from 'app/components/hook-form';

import { useAuthContext } from 'app/auth/hooks';
import { forgotPassword } from 'app/auth/context';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

// ----------------------------------------------------------------------

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues: ForgotPasswordSchemaType = {
    email: '',
  };

  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
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
      // optional: disable button already handled by isSubmitting
      console.log('Sending forgot password for', data.email);

      const res = await forgotPassword({ email: data.email });

      console.log('forgotPassword response:', res);

      if (res.success) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        setErrorMsg(res.message || 'Something went wrong');
      }
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Something went wrong'
      );
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
            <CardTitle>Enter Email to reset credentials</CardTitle>
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
              {errorMsg ? (
                <p className='text-sm text-destructive'>{errorMsg}</p>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
            <p>
              Back to Login?{' '}
              <a href={paths.auth.jwt.signIn} className='text-green-500'>
                LogIn
              </a>
            </p>
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
