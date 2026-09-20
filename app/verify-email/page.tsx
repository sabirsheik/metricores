import { Suspense } from 'react';
import VerifyEmailClient from './verify-email-client';

export const metadata = {
  title: 'Verify Email | Metricores',
  description: 'Verify your Metricores account email address.',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      }
    >
      <VerifyEmailClient searchParams={searchParams} />
    </Suspense>
  );
}
