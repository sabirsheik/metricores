'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/AppContext';
import BrandLogo from './BrandLogo';

export default function GuestLimitModal() {
  const { guestLimitOpen, closeGuestLimit } = useAppContext();
  const { data: session } = useSession();
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!guestLimitOpen) return;

    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGuestLimit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeGuestLimit, guestLimitOpen]);

  if (session?.user) return null;

  return (
    <AnimatePresence>
      {guestLimitOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="guest-limit-title" aria-describedby="guest-limit-description">
          <motion.button type="button" aria-label="Close" onClick={closeGuestLimit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 cursor-default bg-zinc-950/35 backdrop-blur-[3px]" />
          <motion.div ref={dialogRef} tabIndex={-1} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="relative w-full max-w-md border border-zinc-200 bg-white p-6 outline-none shadow-[0_24px_70px_-24px_rgba(0,0,0,0.35)] sm:p-8">
            <button type="button" onClick={closeGuestLimit} aria-label="Close dialog" className="absolute right-4 top-4 p-2 text-zinc-400 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"><X className="h-4 w-4" /></button>
            <div className="mb-6 flex h-11 w-11 items-center justify-center transition-transform duration-200 hover:scale-105"><BrandLogo showText={false} /></div>
            <h2 id="guest-limit-title" className="max-w-sm pr-8 text-2xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-[1.7rem]">Keep your calculations going</h2>
            <p id="guest-limit-description" className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">Create a free account to continue calculating, save your work, and access your calculation history anytime.</p>
            <div className="mt-6 space-y-3 border-y border-zinc-100 py-5 text-sm text-zinc-700">
              <p className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> Continue using supported calculators</p>
              <p className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> Save and revisit calculation history</p>
              <p className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> Access your work across sessions and devices</p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => { closeGuestLimit(); router.push('/auth?mode=signup'); }} className="group inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap bg-zinc-950 px-4 py-3 text-xs font-bold text-white transition-[background-color,transform] duration-200 hover:bg-rose-600 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Create Free Account <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" /></button>
              <button type="button" onClick={() => { closeGuestLimit(); void signIn(undefined, { callbackUrl: window.location.pathname }); }} className="min-h-11 border border-zinc-300 px-4 py-3 text-xs font-bold text-zinc-800 transition-[background-color,border-color,transform] duration-200 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 sm:w-36 sm:shrink-0">Log In</button>
            </div>
            <button type="button" onClick={closeGuestLimit} className="mt-5 block w-full text-center text-xs font-semibold text-zinc-400 transition-colors duration-200 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Maybe later</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}