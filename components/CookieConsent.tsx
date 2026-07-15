import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Check, Settings } from 'lucide-react';

interface CookieConsentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreferences: () => void;
  analyticalCookies: boolean;
  marketingCookies: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  cookieConsentSaved: boolean;
}

export default function CookieConsent({
  isOpen,
  onClose,
  onOpenPreferences,
  analyticalCookies,
  marketingCookies,
  onAcceptAll,
  onRejectAll,
  cookieConsentSaved,
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner only if consent has not been saved yet
    if (!cookieConsentSaved) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [cookieConsentSaved]);

  const handleOpenCustomizer = () => {
    setShowBanner(false);
    onOpenPreferences();
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 md:px-6" id="cookie-consent-banner-shell">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-4xl bg-white/95 backdrop-blur-md border border-zinc-200/60 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] rounded-3xl p-5 md:p-6 font-sans"
          id="cookie-consent-banner"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5" id="cookie-banner-wrapper">
            {/* Left Icon Badge */}
            <div 
              className="bg-zinc-950 text-white p-3 rounded-2xl shrink-0 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 border border-zinc-800/50 shadow-xs" 
              id="cookie-banner-icon-bg"
            >
              <Cookie className="w-5.5 h-5.5" />
            </div>

            {/* Right Content Block (Title, Description & Action Buttons aligned nested underneath) */}
            <div className="flex-1 space-y-4" id="cookie-banner-text-block">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h4 className="text-sm md:text-base font-bold text-zinc-950 tracking-tight">
                    We respect your calculating confidentiality
                  </h4>
                  <span 
                    className="inline-flex items-center bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider rounded-md px-2 py-0.5 border border-emerald-100/80 font-mono uppercase" 
                    id="cookie-banner-badge"
                  >
                    GDPR & CCPA Compliant
                  </span>
                </div>
                <p className="text-[12px] md:text-xs text-zinc-500 leading-relaxed max-w-4xl">
                  We utilize standard cookies to maintain secure platform mechanics, save preferences, and compile fully anonymous diagnostic site metrics. We strictly operate a <strong className="font-semibold text-zinc-950">Zero Input Recording Policy</strong>. Your active input values are never tracked or saved.
                </p>
              </div>

              {/* Actions row: Aligned center */}
              <div 
                className="flex flex-wrap items-center gap-2.5 justify-center" 
                id="cookie-banner-actions"
              >
                <button
                  onClick={handleOpenCustomizer}
                  className="w-full sm:w-auto text-[11px] font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100/80 hover:bg-zinc-200/90 px-4 py-2.5 rounded-full transition-all cursor-pointer focus:outline-none flex items-center justify-center space-x-1.5 border border-zinc-200/20 active:scale-95"
                  id="btn-cookie-customize"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={onRejectAll}
                  className="w-full sm:w-auto text-[11px] font-bold text-zinc-700 hover:text-zinc-950 border border-zinc-200/80 hover:border-zinc-300 bg-white hover:bg-zinc-50 px-4 py-2.5 rounded-full transition-all cursor-pointer focus:outline-none flex items-center justify-center active:scale-95"
                  id="btn-cookie-reject-nonessential"
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={onAcceptAll}
                  className="w-full sm:w-auto text-[11px] font-bold text-white bg-zinc-950 hover:bg-zinc-900 px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer focus:outline-none flex items-center justify-center space-x-1.5 active:scale-95 border border-zinc-950/20"
                  id="btn-cookie-accept-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All Cookies</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
