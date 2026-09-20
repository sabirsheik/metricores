import { Suspense } from 'react';
import AuthClient from './auth-client';

export const metadata = {
  title: 'Sign In | Metricores',
  description: 'Sign in or create a Metricores account.',
  robots: { index: false, follow: false },
};

export default function AuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    }>
      <AuthClient searchParams={searchParams} />
    </Suspense>
  );
}
