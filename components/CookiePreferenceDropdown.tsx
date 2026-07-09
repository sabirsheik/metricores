import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cookie, Check, Shield, HelpCircle, Lock, Info, Tag, CheckSquare, Square } from 'lucide-react';

interface CookiePreferenceDropdownProps {
  analyticalCookies: boolean;
  setAnalyticalCookies: (val: boolean) => void;
  marketingCookies: boolean;
  setMarketingCookies: (val: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: (analytics: boolean, marketing: boolean) => void;
}

export default function CookiePreferenceDropdown({
  analyticalCookies,
  setAnalyticalCookies,
  marketingCookies,
  setMarketingCookies,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
}: CookiePreferenceDropdownProps) {
  const [localAnalytics, setLocalAnalytics] = useState(analyticalCookies);
  const [localMarketing, setLocalMarketing] = useState(marketingCookies);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setLocalAnalytics(analyticalCookies);
  }, [analyticalCookies]);

  React.useEffect(() => {
    setLocalMarketing(marketingCookies);
  }, [marketingCookies]);

  const handleSave = () => {
    onSavePreferences(localAnalytics, localMarketing);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const handleLocalAcceptAll = () => {
    setLocalAnalytics(true);
    setLocalMarketing(true);
    onAcceptAll();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const handleLocalRejectAll = () => {
    setLocalAnalytics(false);
    setLocalMarketing(false);
    onRejectAll();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div 
      className="bg-white border-x border-b border-zinc-200/80 shadow-[0_12px_24px_rgba(0,0,0,0.03)] p-4 sm:p-6 space-y-5 font-sans"
      id="cookie-preference-dropdown-container"
    >
      <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-widest font-mono">
              Operational Consent Matrix
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400">
            Configure sandboxed cookies. Values are strictly processed inside client memory.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLocalAcceptAll}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1.5 transition-all cursor-pointer focus:outline-none border border-zinc-200/60"
            id="dropdown-accept-all-btn"
          >
            Accept All
          </button>
          <button
            onClick={handleLocalRejectAll}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 bg-white hover:bg-zinc-50 px-2.5 py-1.5 transition-all cursor-pointer focus:outline-none border border-zinc-200/60"
            id="dropdown-reject-all-btn"
          >
            Reject All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Category 1: Essential */}
        <div 
          className="p-3 bg-zinc-50/60 border border-zinc-100 flex items-start justify-between gap-4"
          id="dropdown-category-essential"
        >
          <div className="space-y-1 max-w-[85%]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-800 tracking-tight">1. Core Framework Cache</span>
              <span className="text-[9px] bg-zinc-200/80 text-zinc-600 px-1.5 py-0.2 rounded-sm font-mono font-bold uppercase">Required</span>
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed">
              Mandatory local data storage to record viewport scales, visual style sheet rendering variables, and preference states. No tracking logs.
            </p>
          </div>
          <div className="pt-0.5 shrink-0">
            <CheckSquare className="w-4 h-4 text-zinc-400 cursor-not-allowed" />
          </div>
        </div>

        {/* Category 2: Analytical */}
        <div 
          onClick={() => setLocalAnalytics(!localAnalytics)}
          className="p-3 border border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-50/20 transition-all cursor-pointer flex items-start justify-between gap-4 select-none"
          id="dropdown-category-analytical"
        >
          <div className="space-y-1 max-w-[85%]">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-bold text-zinc-800 tracking-tight">2. Anonymized Engine Analytics</span>
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed">
              Maintains high-speed calculations by logging page response latencies and system compile metrics. Absolutely zero identity records.
            </p>
          </div>
          <div className="pt-0.5 shrink-0">
            {localAnalytics ? (
              <CheckSquare className="w-4 h-4 text-zinc-950" />
            ) : (
              <Square className="w-4 h-4 text-zinc-300 hover:text-zinc-400" />
            )}
          </div>
        </div>

        {/* Category 3: Marketing */}
        <div 
          onClick={() => setLocalMarketing(!localMarketing)}
          className="p-3 border border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-50/20 transition-all cursor-pointer flex items-start justify-between gap-4 select-none"
          id="dropdown-category-marketing"
        >
          <div className="space-y-1 max-w-[85%]">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-zinc-800 tracking-tight">3. Contextual Ad Partner Tokens</span>
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed">
              Allows partners like Google AdSense to serve non-personalized contextual banners. We reject cross-site user history compilation.
            </p>
          </div>
          <div className="pt-0.5 shrink-0">
            {localMarketing ? (
              <CheckSquare className="w-4 h-4 text-zinc-950" />
            ) : (
              <Square className="w-4 h-4 text-zinc-300 hover:text-zinc-400" />
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-4">
        <p className="text-[10px] text-zinc-400 max-w-[65%] leading-relaxed">
          *Choices are immediately committed to your browser's sandboxed localStorage model.
        </p>
        <button
          onClick={handleSave}
          className="bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-bold text-[10px] uppercase tracking-wider px-4 py-2 transition-all cursor-pointer focus:outline-none flex items-center gap-1.5"
          id="dropdown-save-choice-btn"
        >
          {saveSuccess ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>
    </div>
  );
}
