'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface VerifyEmailClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function VerifyEmailClient({ searchParams }: VerifyEmailClientProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();

  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          redirect: 'follow',
        });

        const finalUrl = typeof res.url === 'string' ? res.url : '';
        const isVerified = finalUrl.includes('verified=true');
        const isInvalidToken = finalUrl.includes('error=invalid-token');
        const isVerifyFailed = finalUrl.includes('error=verify-failed');

        if (isVerified) {
          setStatus('success');
          toast.success('Email verified successfully! Redirecting to sign in...');
          setTimeout(() => router.push('/auth?verified=true'), 2000);
          return;
        }

        if (isInvalidToken) {
          setStatus('error');
          toast.error('Invalid or expired verification link');
          return;
        }

        if (isVerifyFailed) {
          setStatus('error');
          toast.error('Verification failed. Please try again.');
          return;
        }

        if (res.ok) {
          setStatus('error');
          toast.error('Invalid or expired verification link');
          return;
        }

        setStatus('error');
        toast.error('Verification failed. Please try again.');
      } catch (error) {
        setStatus('error');
        toast.error('Something went wrong. Please try again');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-sm bg-zinc-950 flex items-center justify-center">
            <span className="text-white text-sm font-bold font-mono">M</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h1>
        <p className="text-sm text-zinc-500 font-sans">
          {status === 'loading' && 'Please wait while we verify your email address'}
          {status === 'success' && 'Your email has been verified. Redirecting you to sign in...'}
          {status === 'error' &&
            'The verification link is invalid or has expired'}
        </p>
        {status === 'error' && (
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/auth"
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-6 rounded-sm text-xs transition-all"
            >
              Back to Sign In
            </a>
            <a
              href="/auth"
              className="inline-flex items-center justify-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 font-semibold py-2.5 px-6 rounded-sm text-xs transition-all"
            >
              Resend Verification Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
