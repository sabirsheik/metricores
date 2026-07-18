'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EmailVerificationSuccess from '@/components/EmailVerificationSuccess';
import EmailVerificationError from '@/components/EmailVerificationError';
import { Loader2 } from 'lucide-react';

interface VerifyEmailClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

type VerificationStatus = 'loading' | 'success' | 'invalid-token' | 'expired' | 'already-verified' | 'verify-failed';

export default function VerifyEmailClient({ searchParams }: VerifyEmailClientProps) {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const router = useRouter();

  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('invalid-token');
        toast.error('Invalid or expired verification link');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          redirect: 'follow',
        });

        const finalUrl = typeof res.url === 'string' ? res.url : '';
        
        if (finalUrl.includes('verified=true')) {
          setStatus('success');
          toast.success('Email verified successfully!');
          return;
        }

        if (finalUrl.includes('error=invalid-token')) {
          setStatus('invalid-token');
          toast.error('Invalid or expired verification link');
          return;
        }

        if (finalUrl.includes('error=already-verified')) {
          setStatus('already-verified');
          toast.info('This email is already verified');
          return;
        }

        if (finalUrl.includes('error=verify-failed')) {
          setStatus('verify-failed');
          toast.error('Verification failed. Please try again.');
          return;
        }

        // Fallback for any other case
        setStatus('verify-failed');
        toast.error('Verification failed. Please try again.');
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('verify-failed');
        toast.error('Something went wrong. Please try again');
      }
    };

    verifyEmail();
  }, [token, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Verifying your email...
          </h1>
          <p className="text-sm text-zinc-500 font-sans">
            Please wait while we verify your email address
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return <EmailVerificationSuccess />;
  }

  // Error states
  if (status === 'invalid-token' || status === 'expired' || status === 'already-verified' || status === 'verify-failed') {
    return (
      <EmailVerificationError
        errorType={status}
      />
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
          Verification failed
        </h1>
        <p className="text-sm text-zinc-500 font-sans mb-8">
          Something went wrong. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/auth"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-6 rounded-lg text-xs transition-all"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
