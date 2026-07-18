'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      setSubmittedEmail(values.email);
      setIsSubmitted(true);
      toast.success('Password reset email sent! Check your inbox.');
      form.reset();
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50/50 to-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200/50">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-3">
              Check your email
            </h1>
            <p className="text-base text-zinc-600 font-sans mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-sm font-mono text-zinc-700 bg-zinc-50 py-2 px-3 rounded-lg border border-zinc-200 mb-8">
              {submittedEmail}
            </p>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <a
              href="/auth"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Back to Sign In
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Try Another Email
            </button>
          </motion.div>

          <div className="mt-8 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-500 font-sans">
              Didn't receive the email?{' '}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}
                className="text-zinc-950 hover:text-zinc-800 font-bold transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">M</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2"
          >
            Forgot password?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-zinc-500 font-sans"
          >
            Enter your email to receive a password reset link
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm"
        >
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  {...form.register('email')}
                  className={cn(
                    'w-full pl-9 pr-3 py-1.5 bg-white border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                    form.formState.errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-zinc-200'
                  )}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1.5 font-mono">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 font-sans">
              Remember your password?
              <a
                href="/auth"
                className="ml-1 text-zinc-950 hover:text-zinc-800 font-bold transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
