import { Suspense } from 'react';
import ForgotPasswordClient from './forgot-password-client';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    }>
      <ForgotPasswordClient />
    </Suspense>
  );
}
