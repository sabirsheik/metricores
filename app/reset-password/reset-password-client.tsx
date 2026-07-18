'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordClient({ searchParams }: ResetPasswordClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    }
  }, [token, router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      setIsSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-sm bg-zinc-950 flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            Password reset!
          </h1>
          <p className="text-sm text-zinc-500 font-sans mb-8">
            Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
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
            Reset password
          </h1>
          <p className="text-sm text-zinc-500 font-sans">
            Enter your new password
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm p-8 shadow-2xs">
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
                    'w-full pl-9 pr-9 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
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
                    'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
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
              disabled={isLoading}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset password'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
