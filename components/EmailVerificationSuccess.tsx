'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmailVerificationSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push('/auth');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

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
            Email Verified!
          </h1>
          <p className="text-base text-zinc-600 font-sans mb-2">
            Your email has been successfully verified.
          </p>
          <p className="text-sm text-zinc-500 font-sans mb-8">
            You can now log in to your account and start using Metricores.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            Continue to Sign In
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-500 font-sans">
              Redirecting to sign in in{' '}
              <span className="font-bold text-zinc-700">{countdown}s</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-emerald-500"
          style={{ transformOrigin: 'left', width: '100%' }}
        />
      </div>
    </div>
  );
}
