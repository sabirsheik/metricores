'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

      setIsSubmitted(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-sm bg-zinc-950 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Check your email
          </h1>
          <p className="text-sm text-zinc-500 font-sans mb-8">
            We've sent a password reset link to your email.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-6 rounded-sm text-xs transition-all"
          >
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-sm bg-zinc-950 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Forgot password?
          </h1>
          <p className="text-sm text-zinc-500 font-sans">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm p-8 shadow-2xs">
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
                    'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                    form.formState.errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-zinc-200'
                  )}
                  placeholder="you@example.com"
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
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
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
        </div>
      </div>
    </div>
  );
}
