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
import { signInWithNumber } from 'app/auth/context';
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
  phone: zod
    .string()
    .min(1, { message: 'Phone Number is required!' })
    .regex(/^01\d{9}$/, {
      message: 'Phone must be 11 digits and start with 01 (e.g. 01XXXXXXXXX)',
    }),
});

// ----------------------------------------------------------------------

export function VerifyOtp() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues: SignInSchemaType = {
    phone: '01*********',
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
      await signInWithNumber({ phone: data.phone });
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
            <CardTitle>OTP Verification</CardTitle>
            <CardDescription>
              Enter 4 digit number sent to 'phone number'
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                {/* <Label htmlFor='phone' className='mb-1'> */}
                <div className='flex justify-between items-center'>
                  <p>Enter Otp</p>
                  <Button variant='ghost' className='text-[#0071f4!important]'>
                    Resend Otp
                  </Button>
                </div>
                {/* </Label> */}
                <div className='flex gap-2'>
                  <div className='flex justify-center items-center gap-4'>
                    <Input
                      id='code_1'
                      type='number'
                      placeholder='_'
                      {...register('phone', { valueAsNumber: true })}
                      className='w-full '
                    />

                    <Input
                      id='code_1'
                      type='number'
                      placeholder='_'
                      {...register('phone', { valueAsNumber: true })}
                      className='w-full'
                    />
                    <Input
                      id='code_1'
                      type='number'
                      placeholder='_'
                      {...register('phone', { valueAsNumber: true })}
                      className='w-full'
                    />
                    <Input
                      id='code_1'
                      type='number'
                      placeholder='_'
                      {...register('phone', { valueAsNumber: true })}
                      className='w-full'
                    />
                  </div>
                </div>
              </div>
              {errors.phone?.message && (
                <p className='mt-1 text-sm text-red-600'>
                  {String(errors.phone.message)}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? 'Verifying…' : 'Verify Otp'}
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
                <p className='text-sm'>
                  Please check your email and try again.
                </p>
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
