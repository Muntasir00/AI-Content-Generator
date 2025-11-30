import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter, useSearchParams } from 'app/routes/hooks';
import { Form } from 'app/components/hook-form';

import { verifyOtp } from 'app/auth/context/action';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { paths } from '~/routes/paths';

const OtpSchema = zod.object({
  otp1: zod.string().length(1),
  otp2: zod.string().length(1),
  otp3: zod.string().length(1),
  otp4: zod.string().length(1),
  otp5: zod.string().length(1),
  otp6: zod.string().length(1),
});

type OtpSchemaType = zod.infer<typeof OtpSchema>;

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    setErrorMsg('');

    const otp =
      data.otp1 + data.otp2 + data.otp3 + data.otp4 + data.otp5 + data.otp6;

    const res = await verifyOtp(email, otp);

    if (!res.success) {
      setErrorMsg(res.message ?? 'Invalid OTP');
      return;
    }

    router.push(
      `${paths.auth.jwt.changePassword}?email=${encodeURIComponent(email)}`
    );
  });

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className='flex justify-center items-center h-screen bg-green-50 px-4'>
          <Card className='max-w-md w-full'>
            <CardHeader>
              <CardTitle>OTP Verification</CardTitle>
              <CardDescription>
                Enter the 6-digit OTP sent to <b>{email}</b>
              </CardDescription>
            </CardHeader>

            <CardContent className='flex justify-between gap-2'>
              {['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'].map(field => (
                <Input
                  key={field}
                  {...register(field as keyof OtpSchemaType)}
                  maxLength={1}
                  className='w-12 h-12 text-center text-xl'
                />
              ))}

              {errorMsg && (
                <Alert variant='destructive' className='mb-4'>
                  <AlertCircleIcon />
                  <div>
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              <Button type='submit' disabled={isSubmitting} className='w-full'>
                {isSubmitting ? 'Verifying…' : 'Verify OTP'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Form>
    </>
  );
}
