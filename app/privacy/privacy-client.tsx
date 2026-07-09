"use client";

import PrivacyView from "@/components/PrivacyView";
import { useAppContext } from "@/lib/AppContext";

export default function PrivacyClient() {
  const {
    cookieSettingsOpen,
    setCookieSettingsOpen,
    analyticalCookies,
    setAnalyticalCookies,
    marketingCookies,
    setMarketingCookies,
    onAcceptAll,
    onRejectAll,
    onSavePreferences,
  } = useAppContext();

  return (
    <PrivacyView
      cookieSettingsOpen={cookieSettingsOpen}
      setCookieSettingsOpen={setCookieSettingsOpen}
      analyticalCookies={analyticalCookies}
      setAnalyticalCookies={setAnalyticalCookies}
      marketingCookies={marketingCookies}
      setMarketingCookies={setMarketingCookies}
      onAcceptAll={onAcceptAll}
      onRejectAll={onRejectAll}
      onSavePreferences={onSavePreferences}
      onOpenCookieSettings={() => setCookieSettingsOpen(true)}
    />
  );
}
