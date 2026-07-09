"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default values first
  const [cookieConsentSaved, setCookieConsentSaved] = useState<boolean>(false);
  const [analyticalCookies, setAnalyticalCookies] = useState<boolean>(false);
  const [marketingCookies, setMarketingCookies] = useState<boolean>(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  
  // Load from localStorage after hydration
  useEffect(() => {
    const savedConsent = localStorage.getItem("metricores-cookie-consent-saved") === "true";
    const savedAnalytics = localStorage.getItem("metricores-cookie-analytics") === "true";
    const savedMarketing = localStorage.getItem("metricores-cookie-marketing") === "true";
    
    setCookieConsentSaved(savedConsent);
    setAnalyticalCookies(savedAnalytics);
    setMarketingCookies(savedMarketing);
  }, []);

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
