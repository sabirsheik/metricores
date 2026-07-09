import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import HomeView from './components/HomeView';
import CalculatorView from './components/CalculatorView';
import GuidesView from './components/GuidesView';
import AboutView from './components/AboutView';
import FAQView from './components/FAQView';
import TermsView from './components/TermsView';
import PrivacyView from './components/PrivacyView';
import NotFoundView from './components/NotFoundView';
import CookieConsent from './components/CookieConsent';
import GraphingView from './components/GraphingView';
import { calculatorsData } from './data/calculators';
import { ToastProvider } from './components/calculator/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);

  // Lifted cookie consent states
  const [cookieConsentSaved, setCookieConsentSaved] = useState<boolean>(() => {
    return localStorage.getItem('metricores-cookie-consent-saved') === 'true';
  });
  const [analyticalCookies, setAnalyticalCookies] = useState<boolean>(() => {
    return localStorage.getItem('metricores-cookie-analytics') === 'true';
  });
  const [marketingCookies, setMarketingCookies] = useState<boolean>(() => {
    return localStorage.getItem('metricores-cookie-marketing') === 'true';
  });

  const handleAcceptAllCookies = () => {
    localStorage.setItem('metricores-cookie-consent-saved', 'true');
    localStorage.setItem('metricores-cookie-analytics', 'true');
    localStorage.setItem('metricores-cookie-marketing', 'true');
    setAnalyticalCookies(true);
    setMarketingCookies(true);
    setCookieConsentSaved(true);
    setCookieSettingsOpen(false);
  };

  const handleRejectAllCookies = () => {
    localStorage.setItem('metricores-cookie-consent-saved', 'true');
    localStorage.setItem('metricores-cookie-analytics', 'false');
    localStorage.setItem('metricores-cookie-marketing', 'false');
    setAnalyticalCookies(false);
    setMarketingCookies(false);
    setCookieConsentSaved(true);
    setCookieSettingsOpen(false);
  };

  const handleSaveCookiePreferences = (analytics: boolean, marketing: boolean) => {
    localStorage.setItem('metricores-cookie-consent-saved', 'true');
    localStorage.setItem('metricores-cookie-analytics', String(analytics));
    localStorage.setItem('metricores-cookie-marketing', String(marketing));
    setAnalyticalCookies(analytics);
    setMarketingCookies(marketing);
    setCookieConsentSaved(true);
  };

  // Sync theme with DOM element (force light/white theme properly)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('metricores-theme', 'light');
  }, []);

  // Sync state with simple hash-based routing for bookmarking / browser history support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash) {
        setCurrentTab('home');
        setActiveGuideId(null);
        return;
      }

      if (hash.startsWith('guide-')) {
        const articleId = hash.replace('guide-', '');
        setCurrentTab('guides');
        setActiveGuideId(articleId);
      } else {
        const cleanTab = hash.split('?')[0];
        if (cleanTab === 'calculators') {
          window.location.hash = '#/home';
          setCurrentTab('home');
          setActiveGuideId(null);
          return;
        }
        setCurrentTab(cleanTab);
        setActiveGuideId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger on initial load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (newTab: string) => {
    if (newTab === 'cookie-settings') {
      setCookieSettingsOpen(true);
      return;
    }
    if (newTab === 'open-search') {
      setSearchOpen(true);
      return;
    }
    if (newTab === 'calculators') {
      window.location.hash = '#/home';
      setCurrentTab('home');
      setActiveGuideId(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    window.location.hash = `#/${newTab}`;
    setCurrentTab(newTab);
    setActiveGuideId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCalculator = (id: string) => {
    window.location.hash = `#/calculator-${id}`;
    setCurrentTab(`calculator-${id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectGuide = (id: string | null) => {
    if (id) {
      window.location.hash = `#/guide-${id}`;
      setCurrentTab('guides');
      setActiveGuideId(id);
    } else {
      window.location.hash = '#/guides';
      setCurrentTab('guides');
      setActiveGuideId(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Render correct main view depending on currentTab
  const renderMainContent = () => {
    if (currentTab === 'home') {
      return (
        <HomeView
          onNavigateToTab={handleTabChange}
          onNavigateToCalculator={handleSelectCalculator}
          onNavigateToGuide={handleSelectGuide}
        />
      );
    }

    if (currentTab === 'graphing' || currentTab === 'calculator-graphing') {
      return <GraphingView />;
    }

    if (currentTab === 'guides') {
      return (
        <GuidesView
          activeGuideId={activeGuideId}
          onSelectGuide={handleSelectGuide}
          onNavigateToCalculator={handleSelectCalculator}
        />
      );
    }

    if (currentTab === 'about') {
      return <AboutView />;
    }

    if (currentTab === 'faq') {
      return <FAQView />;
    }

    if (currentTab === 'terms') {
      return <TermsView />;
    }

    if (currentTab === 'privacy') {
      return (
        <PrivacyView
          cookieSettingsOpen={cookieSettingsOpen}
          setCookieSettingsOpen={setCookieSettingsOpen}
          analyticalCookies={analyticalCookies}
          setAnalyticalCookies={setAnalyticalCookies}
          marketingCookies={marketingCookies}
          setMarketingCookies={setMarketingCookies}
          onAcceptAll={handleAcceptAllCookies}
          onRejectAll={handleRejectAllCookies}
          onSavePreferences={handleSaveCookiePreferences}
          onOpenCookieSettings={() => setCookieSettingsOpen(!cookieSettingsOpen)}
        />
      );
    }

    // Individual Calculator Pages
    if (currentTab.startsWith('calculator-')) {
      const calcId = currentTab.replace('calculator-', '');
      const selectedCalc = calculatorsData[calcId as any];
      if (selectedCalc) {
        return (
          <CalculatorView
            calculator={selectedCalc}
            onBack={() => handleTabChange('home')}
            onNavigateToCalculator={handleSelectCalculator}
          />
        );
      }
    }

    // 404 Route Fallback
    return (
      <NotFoundView
        onGoHome={() => handleTabChange('home')}
        onSearch={(q) => {
          handleTabChange('home');
          setSearchOpen(true);
        }}
      />
    );
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 transition-colors duration-200">
        {/* Search Keyboard Palette */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectCalculator={handleSelectCalculator}
        />

        {/* Corporate Header */}
        <Header
          currentTab={currentTab}
          onChangeTab={handleTabChange}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Scrollable View Center */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab + (activeGuideId || '')}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-full"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Standard Footer */}
        <Footer onChangeTab={handleTabChange} />

        {/* Global Compliance Cookie Management */}
        <CookieConsent 
          isOpen={cookieSettingsOpen} 
          onClose={() => setCookieSettingsOpen(false)} 
          onOpenPreferences={() => {
            window.location.hash = '#/privacy';
            setCookieSettingsOpen(true);
            setTimeout(() => {
              const element = document.getElementById('cookie-settings-card');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 200);
          }}
          analyticalCookies={analyticalCookies}
          marketingCookies={marketingCookies}
          onAcceptAll={handleAcceptAllCookies}
          onRejectAll={handleRejectAllCookies}
          cookieConsentSaved={cookieConsentSaved}
        />
      </div>
    </ToastProvider>
  );
}
