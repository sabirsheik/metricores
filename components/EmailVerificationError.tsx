'use client';

import { useState } from 'react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface EmailVerificationErrorProps {
  errorType: 'invalid-token' | 'already-verified' | 'expired' | 'verify-failed';
  email?: string;
}

export default function EmailVerificationError({
  errorType,
  email,
}: EmailVerificationErrorProps) {
  const [isResending, setIsResending] = useState(false);

  const errorMessages = {
    'invalid-token': {
      title: 'Invalid or Expired Link',
      message: 'This verification link is no longer valid or has expired.',
      subtext: 'Request a new verification email to complete your registration.',
    },
    'already-verified': {
      title: 'Email Already Verified',
      message: 'Your email has already been verified.',
      subtext: 'You can proceed to sign in to your account.',
    },
    'expired': {
      title: 'Link Expired',
      message: 'The verification link has expired.',
      subtext: 'Verification links are valid for 24 hours. Request a new one below.',
    },
    'verify-failed': {
      title: 'Verification Failed',
      message: 'Something went wrong during verification.',
      subtext: 'Please try again or request a new verification email.',
    },
  };

  const config = errorMessages[errorType];

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email not provided');
      return;
    }

    setIsResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to resend email');
        return;
      }

      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50/50 to-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center border border-red-200/50">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-3">
            {config.title}
          </h1>
          <p className="text-base text-zinc-600 font-sans mb-2">
            {config.message}
          </p>
          <p className="text-sm text-zinc-500 font-sans mb-8">
            {config.subtext}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          {email && errorType !== 'already-verified' && (
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Resend Verification Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          <a
            href="/auth"
            className={`w-full inline-flex items-center justify-center gap-2 ${
              errorType === 'already-verified'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-4'
            } rounded-lg text-sm transition-all`}
          >
            {errorType === 'already-verified' ? 'Go to Sign In' : 'Back to Sign In'}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
