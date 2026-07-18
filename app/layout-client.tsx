"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import CookieConsent from "@/components/CookieConsent";
import { useAppContext } from "@/lib/AppContext";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cookieSettingsOpen,
    setCookieSettingsOpen,
    analyticalCookies,
    marketingCookies,
    onAcceptAll,
    onRejectAll,
    cookieConsentSaved,
  } = useAppContext();

  const [searchOpen, setSearchOpen] = useState(false);

  const handleTabChange = (newTab: string) => {
    if (newTab === "cookie-settings") {
      setCookieSettingsOpen(true);
      return;
    }
    if (newTab === "open-search") {
      setSearchOpen(true);
      return;
    }
    let targetPath = "/";
    if (newTab === "calculators" || newTab === "home") {
      targetPath = "/";
    } else if (newTab.startsWith("calculator-")) {
      // Handle calculator-* tabs
      const calcId = newTab.replace("calculator-", "");
      targetPath = `/calculators/${calcId}`;
    } else {
      targetPath = `/${newTab}`;
    }
    router.push(targetPath);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSelectCalculator = (id: string) => {
    router.push(`/calculators/${id}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSelectGuide = (id: string | null) => {
    if (id) {
      router.push(`/guides#${id}`);
    } else {
      router.push("/guides");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("metricores-theme", "light");
  }, []);

  const hideChrome =
    pathname === "/auth" ||
    pathname.startsWith("/auth/") ||
    pathname === "/verify-email" ||
    pathname.startsWith("/verify-email/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/");

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900">
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectCalculator={handleSelectCalculator}
        />
        {!hideChrome && (
          <Header
            currentTab={
              pathname === "/" || pathname === "/home"
                ? "calculators"
                : pathname.startsWith("/calculators/")
                  ? pathname.slice(1).replace("/", "-")
                  : pathname.slice(1)
            }
            onChangeTab={handleTabChange}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}
        <main className="flex-grow">
          {/* Simplified animation for faster navigation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08, ease: "easeOut" }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideChrome && <Footer onChangeTab={handleTabChange} />}
        <CookieConsent
          isOpen={cookieSettingsOpen}
          onClose={() => setCookieSettingsOpen(false)}
          onOpenPreferences={() => {
            router.push("/privacy");
            setCookieSettingsOpen(true);
            setTimeout(() => {
              const element = document.getElementById("cookie-settings-card");
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });
              }
            }, 200);
          }}
          analyticalCookies={analyticalCookies}
          marketingCookies={marketingCookies}
          onAcceptAll={onAcceptAll}
          onRejectAll={onRejectAll}
          cookieConsentSaved={cookieConsentSaved}
        />
      </div>
    </SessionProvider>
  );
}
