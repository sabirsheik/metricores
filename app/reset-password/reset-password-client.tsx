'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import { validatePassword } from '@/utils/password';

const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const validation = validatePassword(data.password);
    if (!validation.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validation.message,
        path: ['password'],
      });
    }

    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

type ResetPasswordStatus = 'loading' | 'form' | 'success' | 'invalid-token' | 'expired' | 'error';

export default function ResetPasswordClient({ searchParams }: ResetPasswordClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ResetPasswordStatus>('loading');
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState<string | undefined>(
    Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = form.watch('password');
  const confirmPasswordValue = form.watch('confirmPassword');
  const passwordValidation = validatePassword(passwordValue || '');
  const showPasswordRequirements = Boolean(passwordValue);
  const submitDisabled = isLoading || !passwordValidation.isValid || !confirmPasswordValue || passwordValue !== confirmPasswordValue;

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');

      if (urlToken) {
        setToken(urlToken);
        return;
      }
    }

    if (!token) {
      toast.error('Invalid reset link');
      setStatus('invalid-token');
      return;
    }

    setStatus('form');
  }, [token]);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    if (!passwordValidation.isValid) {
      form.setError('password', { type: 'manual', message: passwordValidation.message });
      toast.error(passwordValidation.message);
      return;
    }

    if (!confirmPasswordValue || passwordValue !== confirmPasswordValue) {
      form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400 && data.error?.includes('expired')) {
          setStatus('expired');
          toast.error('Reset link has expired');
          return;
        }
        toast.error(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }

      setStatus('success');
      toast.success('Password reset successfully!');
      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Something went wrong');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    setIsResending(true);
    try {
      // User would need to enter email to request new link
      router.push('/forgot-password');
    } catch (error) {
      toast.error('Failed to redirect');
    } finally {
      setIsResending(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Validating reset link...
          </h1>
          <p className="text-sm text-zinc-500 font-sans">
            Please wait while we verify your reset link
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (status === 'invalid-token') {
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
              Invalid Reset Link
            </h1>
            <p className="text-base text-zinc-600 font-sans mb-2">
              This password reset link is not valid.
            </p>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              Please request a new password reset link to proceed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <a
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Request New Reset Link
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/auth"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Back to Sign In
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  // Expired token state
  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50/50 to-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-14 h-14 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200/50">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-3">
              Reset Link Expired
            </h1>
            <p className="text-base text-zinc-600 font-sans mb-2">
              Your password reset link has expired.
            </p>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              Reset links are valid for 1 hour. Please request a new one to continue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <a
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Request New Reset Link
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/auth"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Back to Sign In
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50/50 to-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200/50">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-3">
              Password Reset Successfully!
            </h1>
            <p className="text-base text-zinc-600 font-sans mb-2">
              Your password has been changed.
            </p>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              You can now sign in with your new password.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <a
              href="/auth"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-sm hover:shadow-md"
            >
              Continue to Sign In
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            style={{ transformOrigin: 'left', width: '100%' }}
          />
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
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
              Password Reset Failed
            </h1>
            <p className="text-base text-zinc-600 font-sans mb-2">
              Something went wrong during password reset.
            </p>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              Please try again or request a new reset link.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <button
              onClick={() => setStatus('form')}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Try Again
            </button>
            <a
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              Request New Link
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Reset password
          </h1>
          <p className="text-sm text-zinc-500 font-sans">
            Enter your new password to regain access
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  className={cn(
                    'w-full pl-9 pr-9 py-1.5 bg-white border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                    form.formState.errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-zinc-200'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1.5 font-mono">
                  {form.formState.errors.password.message}
                </p>
              )}

              {showPasswordRequirements && (
                <div className="mt-2 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-zinc-600">
                      Strength: {passwordValidation.strength}
                    </span>
                    <span className={cn('text-[11px] font-medium', passwordValidation.isValid ? 'text-emerald-600' : 'text-zinc-500')}>
                      {passwordValidation.message}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className={cn('h-full transition-all',
                        passwordValidation.strength === 'Weak' ? 'w-1/3 bg-red-500' :
                        passwordValidation.strength === 'Medium' ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500')}
                    />
                  </div>
                  <div className="grid gap-1.5 text-[11px] text-zinc-600">
                    {[
                      ['At least 6 characters', passwordValidation.requirements.length],
                      ['1 uppercase letter', passwordValidation.requirements.uppercase],
                      ['1 lowercase letter', passwordValidation.requirements.lowercase],
                      ['1 number', passwordValidation.requirements.number],
                      ['1 special character', passwordValidation.requirements.special],
                      ['Avoid common passwords', passwordValidation.requirements.common],
                      ['Avoid repeated characters', passwordValidation.requirements.repeated],
                      ['Avoid sequential patterns', passwordValidation.requirements.sequential],
                    ].map(([label, met]) => {
                      const requirementLabel = label as string;
                      return (
                        <div key={requirementLabel} className="flex items-center gap-2">
                          <span className={cn('h-2.5 w-2.5 rounded-full', met ? 'bg-emerald-500' : 'bg-zinc-300')} />
                          <span className={met ? 'text-emerald-700' : 'text-zinc-600'}>{requirementLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('confirmPassword')}
                  className={cn(
                    'w-full pl-9 pr-3 py-1.5 bg-white border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                    form.formState.errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-zinc-200'
                  )}
                  placeholder="••••••••"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5 font-mono">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitDisabled}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset password'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500 font-sans">
              Know your password?{' '}
              <a href="/auth" className="text-zinc-950 hover:text-zinc-800 font-bold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
