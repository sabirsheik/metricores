import { Suspense } from 'react';
import ResetPasswordClient from './reset-password-client';

export const metadata = {
  title: 'Reset Password | Metricores',
  description: 'Reset your Metricores account password.',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage({
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
      <ResetPasswordClient searchParams={searchParams} />
    </Suspense>
  );
}
