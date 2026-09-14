'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import { validatePassword } from '@/utils/password';
import BrandLogo from '@/components/BrandLogo';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
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

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter your password'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

interface AuthClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AuthClient({ searchParams }: AuthClientProps) {
  // ALL hook declarations first, before any early returns
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const clientSearchParams = useSearchParams();
  const verificationToastShownRef = useRef(false);

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = signUpForm.watch('password');
  const confirmPasswordValue = signUpForm.watch('confirmPassword');
  const passwordValidation = validatePassword(passwordValue || '');
  const showPasswordRequirements = Boolean(passwordValue);
  const submitDisabled =
    isLoading || !passwordValidation.isValid || !confirmPasswordValue || passwordValue !== confirmPasswordValue;

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (session) {
      router.push('/profile');
      return;
    }

    const getParam = (key: string) => {
      const clientValue = clientSearchParams?.get(key);
      if (clientValue !== null) {
        return clientValue;
      }

      const serverValue = searchParams[key];
      if (Array.isArray(serverValue)) {
        return serverValue[0];
      }
      return serverValue;
    };

    setIsSignUp(getParam('mode') === 'signup');

    const error = getParam('error');
    if (error === 'EmailNotVerified') {
      const email = getParam('email');
      setUnverifiedEmail(email || '');
    } else if (error === 'invalid-token') {
      toast.error('Invalid or expired verification link');
    } else if (error === 'verify-failed') {
      toast.error('Something went wrong during verification');
    }

    const verified = getParam('verified');
    if (verified === 'true' && !verificationToastShownRef.current) {
      verificationToastShownRef.current = true;
      toast.success('Email verified successfully! Ready to sign in.');

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('verified');
      router.replace(`${currentUrl.pathname}${currentUrl.search}`);
    }
  }, [session, router, clientSearchParams, searchParams]);

  // Now handle early returns
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  const handleSignUp = async (values: SignUpFormValues) => {
    if (!passwordValidation.isValid) {
      signUpForm.setError('password', { type: 'manual', message: passwordValidation.message });
      toast.error(passwordValidation.message);
      return;
    }

    if (!confirmPasswordValue || passwordValue !== confirmPasswordValue) {
      signUpForm.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      toast.success(data.message || 'Account created successfully! Check your email.');
      setIsSignUp(false);
      setUnverifiedEmail(values.email);
      signInForm.reset({ email: values.email, password: '' });
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log('[Auth Client] signIn result:', result);

      // Check for EmailNotVerified: no URL parsing at all!
      const isEmailNotVerified = 
        (result?.url && typeof result.url === 'string' && result.url.includes('EmailNotVerified')) ||
        (result?.error && typeof result.error === 'string' && result.error.includes('EmailNotVerified'));

      if (isEmailNotVerified) {
        setUnverifiedEmail(values.email);
        toast.error('Please verify your email before signing in.');
        return;
      }

      if (result?.error) {
        toast.error('Invalid email or password');
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/profile');
    } catch (error) {
      console.error('[Auth Client] signIn error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setIsResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      toast.success('Verification email resent!');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('[Auth Page] Starting Google sign-in...');
    try {
      const result = await signIn('google', { 
        callbackUrl: '/profile',
        redirect: true 
      });
      console.log('[Auth Page] Google sign-in result:', result);
    } catch (error) {
      console.error('[Auth Page] Google sign-in error:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/30 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <BrandLogo className="h-14 md:h-16" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-heading mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-zinc-500 font-sans max-w-sm mx-auto">
            {isSignUp
              ? 'Sign up to get started with Metricores'
              : 'Sign in to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-sm p-8 shadow-2xs">
          {/* Unverified Email Warning */}
          {unverifiedEmail && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-amber-800 font-semibold mb-2">
                    Email verification required
                  </p>
                  <p className="text-xs text-amber-700 mb-3">
                    Please verify your email address to continue.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-800 disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Resend verification email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-700 py-2.5 px-4 rounded-sm font-semibold text-xs hover:bg-zinc-50 transition-all mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-zinc-400 font-bold uppercase tracking-widest">
                or continue with email
              </span>
            </div>
          </div>

          {/* Forms */}
          {isSignUp ? (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    {...signUpForm.register('fullName')}
                    className={cn(
                      'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signUpForm.formState.errors.fullName
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-zinc-200'
                    )}
                    placeholder="John Doe"
                  />
                </div>
                {signUpForm.formState.errors.fullName && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signUpForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    {...signUpForm.register('email')}
                    className={cn(
                      'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signUpForm.formState.errors.email
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-zinc-200'
                    )}
                    placeholder="you@example.com"
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signUpForm.register('password')}
                    className={cn(
                      'w-full pl-9 pr-9 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signUpForm.formState.errors.password
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
                {signUpForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}

                {showPasswordRequirements && (
                  <div className="mt-2 space-y-2 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signUpForm.register('confirmPassword')}
                    className={cn(
                      'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signUpForm.formState.errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-zinc-200'
                    )}
                    placeholder="••••••••"
                  />
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitDisabled}
                className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    {...signInForm.register('email')}
                    className={cn(
                      'w-full pl-9 pr-3 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signInForm.formState.errors.email
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-zinc-200'
                    )}
                    placeholder="you@example.com"
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signInForm.register('password')}
                    className={cn(
                      'w-full pl-9 pr-9 py-1.5 bg-white border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all',
                      signInForm.formState.errors.password
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
                {signInForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 font-mono">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-semibold py-2.5 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Footer Toggle */}
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 font-sans">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setUnverifiedEmail(null);
                }}
                className="ml-1 text-zinc-950 hover:text-zinc-800 font-bold transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
