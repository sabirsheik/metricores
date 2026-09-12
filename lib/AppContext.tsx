"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const GUEST_CALCULATION_LIMIT = 3;
export const GUEST_USAGE_KEY = "metricores-guest-calculation-usage";

interface AppContextType {
  cookieSettingsOpen: boolean;
  setCookieSettingsOpen: (val: boolean) => void;
  analyticalCookies: boolean;
  setAnalyticalCookies: (val: boolean) => void;
  marketingCookies: boolean;
  setMarketingCookies: (val: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: (analytics: boolean, marketing: boolean) => void;
  cookieConsentSaved: boolean;
  guestCalculationsUsed: number;
  guestUsageReady: boolean;
  attemptGuestCalculation: () => boolean;
  guestLimitOpen: boolean;
  openGuestLimit: () => void;
  closeGuestLimit: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default values first
  const [cookieConsentSaved, setCookieConsentSaved] = useState<boolean>(false);
  const [analyticalCookies, setAnalyticalCookies] = useState<boolean>(false);
  const [marketingCookies, setMarketingCookies] = useState<boolean>(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [guestCalculationsUsed, setGuestCalculationsUsed] = useState(0);
  const [guestUsageReady, setGuestUsageReady] = useState(false);
  
  // Load from localStorage after hydration
  useEffect(() => {
    const savedConsent = localStorage.getItem("metricores-cookie-consent-saved") === "true";
    const savedAnalytics = localStorage.getItem("metricores-cookie-analytics") === "true";
    const savedMarketing = localStorage.getItem("metricores-cookie-marketing") === "true";
    
    setCookieConsentSaved(savedConsent);
    setAnalyticalCookies(savedAnalytics);
    setMarketingCookies(savedMarketing);

    const storedUsage = Number.parseInt(localStorage.getItem(GUEST_USAGE_KEY) || "0", 10);
    setGuestCalculationsUsed(Number.isFinite(storedUsage) ? Math.min(Math.max(storedUsage, 0), GUEST_CALCULATION_LIMIT) : 0);
    setGuestUsageReady(true);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== GUEST_USAGE_KEY) return;
      const nextUsage = Number.parseInt(event.newValue || "0", 10);
      setGuestCalculationsUsed(Number.isFinite(nextUsage) ? Math.min(Math.max(nextUsage, 0), GUEST_CALCULATION_LIMIT) : 0);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const [guestLimitOpen, setGuestLimitOpen] = useState(false);
  const openGuestLimit = useCallback(() => setGuestLimitOpen(true), []);
  const closeGuestLimit = useCallback(() => setGuestLimitOpen(false), []);
  const attemptGuestCalculation = useCallback(() => {
    if (!guestUsageReady) return false;
    if (guestCalculationsUsed >= GUEST_CALCULATION_LIMIT) {
      setGuestLimitOpen(true);
      return false;
    }
    const nextUsage = guestCalculationsUsed + 1;
    setGuestCalculationsUsed(nextUsage);
    localStorage.setItem(GUEST_USAGE_KEY, String(nextUsage));
    return true;
  }, [guestCalculationsUsed, guestUsageReady]);

  const handleAcceptAllCookies = () => {
    localStorage.setItem("metricores-cookie-consent-saved", "true");
    localStorage.setItem("metricores-cookie-analytics", "true");
    localStorage.setItem("metricores-cookie-marketing", "true");
    setAnalyticalCookies(true);
    setMarketingCookies(true);
    setCookieConsentSaved(true);
    setCookieSettingsOpen(false);
  };

  const handleRejectAllCookies = () => {
    localStorage.setItem("metricores-cookie-consent-saved", "true");
    localStorage.setItem("metricores-cookie-analytics", "false");
    localStorage.setItem("metricores-cookie-marketing", "false");
    setAnalyticalCookies(false);
    setMarketingCookies(false);
    setCookieConsentSaved(true);
    setCookieSettingsOpen(false);
  };

  const handleSaveCookiePreferences = (
    analytics: boolean,
    marketing: boolean
  ) => {
    localStorage.setItem("metricores-cookie-consent-saved", "true");
    localStorage.setItem("metricores-cookie-analytics", String(analytics));
    localStorage.setItem("metricores-cookie-marketing", String(marketing));
    setAnalyticalCookies(analytics);
    setMarketingCookies(marketing);
    setCookieConsentSaved(true);
  };

  return (
    <AppContext.Provider
      value={{
        cookieSettingsOpen,
        setCookieSettingsOpen,
        analyticalCookies,
        setAnalyticalCookies,
        marketingCookies,
        setMarketingCookies,
        onAcceptAll: handleAcceptAllCookies,
        onRejectAll: handleRejectAllCookies,
        onSavePreferences: handleSaveCookiePreferences,
        cookieConsentSaved,
        guestCalculationsUsed,
        guestUsageReady,
        attemptGuestCalculation,
        guestLimitOpen,
        openGuestLimit,
        closeGuestLimit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
