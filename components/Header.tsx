import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  TrendingUp,
  Home as HomeIcon,
  Percent,
  FileText,
  CreditCard,
  Clock,
  Scale,
  Award,
  Tag,
  Coins,
  Receipt,
  ChevronDown,
  ChevronUp,
  User,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { calculatorsData } from '@/data/calculators';

const calcIcons: Record<string, any> = {
  graphing: TrendingUp,
  mortgage: HomeIcon,
  loan: Percent,
  tax: FileText,
  interest: TrendingUp,
  payment: CreditCard,
  time: Clock,
  'profit-margin': Scale,
  roi: Award,
  percentage: Percent,
  discount: Tag,
  tip: Coins,
  vat: Receipt
};

interface HeaderProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export default function Header({
  currentTab,
  onChangeTab,
  onOpenSearch
}: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobileCalcsOpen, setIsMobileCalcsOpen] = useState(false);
  const [mobileShowAll, setMobileShowAll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu on tab change
  const handleTabClick = (tab: string) => {
    onChangeTab(tab);
    setMobileMenuOpen(false);
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Guides', id: 'guides' },
    { label: 'About', id: 'about' }
  ];

  const calculatorsList = Object.values(calculatorsData);
  const visibleCalculators = showAll ? calculatorsList : calculatorsList.slice(0, 8);
  const mobileVisibleCalculators = mobileShowAll ? calculatorsList : calculatorsList.slice(0, 8);

  const isCalculatorsActive =
    currentTab.startsWith('calculator-') ||
    currentTab === 'calculators';

  const handleCalculatorSelect = (calcId: string) => {
    const tabId = `calculator-${calcId}`;
    handleTabClick(tabId);
    setIsDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-200 ${
        isScrolled ? 'border-zinc-300 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.35)]' : 'border-zinc-200'
      }`}
      id="site-header"
    >
      <div className="relative max-w-[95%] w-[95%] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between" id="header-container">
        {/* Left Side: Brand Logo */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center text-zinc-900 font-heading font-bold text-base md:text-lg tracking-tight select-none focus:outline-none focus:ring-1 focus:ring-zinc-950/10 rounded-sm cursor-pointer"
          id="brand-logo"
        >
          <span className="inline-flex w-8 h-8 rounded-xl bg-zinc-950 items-center justify-center text-white text-sm font-mono font-bold tracking-tighter shadow-sm">
            M
          </span>
          <span className="font-semibold tracking-tight text-zinc-900 text-sm md:text-base ml-3">
            Metricores
          </span>
        </button>

        {/* Center: Desktop Nav Link bar */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 h-full absolute left-1/2 top-0 bottom-0 -translate-x-1/2" id="desktop-nav">
          {/* Calculators Dropdown Menu */}
          <div
            className="relative flex items-center h-full"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => {
              setIsDropdownOpen(false);
              setShowAll(false);
            }}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-1.5 text-xs font-semibold tracking-wide font-sans cursor-pointer focus:outline-none transition-all duration-150 py-1.5 border-b-2 ${
                isCalculatorsActive
                  ? 'text-zinc-950 border-zinc-950 font-bold'
                  : 'text-zinc-500 hover:text-zinc-950 border-transparent hover:border-zinc-200'
              }`}
              id="nav-item-calculators"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span>Calculators</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[580px] bg-white border border-zinc-200 rounded-sm shadow-xl z-50 p-5"
                  style={{ transformOrigin: 'top center' }}
                  id="calculators-mega-menu"
                >
                  <div className="border-b border-zinc-100 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase font-sans">Metricores Calculators</h3>
                      <p className="text-[10px] text-zinc-400 font-sans mt-0.5">Select a specialized calculator to run accurate metrics.</p>
                    </div>
                    {isCalculatorsActive && (
                      <span className="text-[9px] bg-zinc-100 text-zinc-800 font-bold py-0.5 px-2 rounded-sm border border-zinc-200/50 uppercase font-sans">
                        Active Tool
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1" id="mega-menu-grid">
                    {visibleCalculators.map((calc) => {
                      const Icon = calcIcons[calc.id] || Percent;
                      const isActive = currentTab === `calculator-${calc.id}`;
                      return (
                        <button
                          key={calc.id}
                          onClick={() => handleCalculatorSelect(calc.id)}
                          className={`group flex items-center space-x-3.5 p-3 rounded-sm border transition-all text-left w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-950/10 ${
                            isActive
                              ? 'bg-zinc-50 border-zinc-300 shadow-3xs'
                              : 'bg-transparent border-transparent hover:bg-zinc-50/70 hover:border-zinc-200'
                          }`}
                          title={calc.shortDescription}
                        >
                          <div className={`p-2 rounded-sm border transition-all flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-zinc-950 border-zinc-950 text-white shadow-2xs'
                              : 'bg-zinc-50 border-zinc-200/50 text-zinc-500 group-hover:text-zinc-950 group-hover:bg-zinc-100 group-hover:border-zinc-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[11px] font-bold truncate transition-colors ${
                                isActive ? 'text-zinc-950' : 'text-zinc-800 group-hover:text-zinc-950'
                              }`}>
                                {calc.name}
                              </span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse shrink-0" />
                              )}
                            </div>
                            <p className="text-[9px] text-zinc-400 font-sans uppercase font-semibold tracking-wider mt-0.5 truncate">
                              {calc.category}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAll(!showAll);
                    }}
                    className="w-full mt-4 pt-3.5 border-t border-dashed border-zinc-200 hover:bg-zinc-50 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {showAll ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Show More (+{calculatorsList.length - 8} Calculators)</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`text-xs font-semibold tracking-wide font-sans cursor-pointer focus:outline-none transition-all duration-150 py-1.5 border-b-2 ${
                  isActive
                    ? 'text-zinc-950 border-zinc-950 font-bold'
                    : 'text-zinc-500 hover:text-zinc-950 border-transparent hover:border-zinc-200'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Tools (Search, Auth, Mobile Trigger) */}
        <div className="flex items-center space-x-1 sm:space-x-2" id="header-tools-row">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-sm transition-all duration-150 relative flex items-center cursor-pointer focus:outline-none"
            title="Search (Cmd + K)"
            id="header-search-btn"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline-flex items-center text-[9px] text-zinc-500 ml-2 font-mono px-1 bg-zinc-50 border border-zinc-200 rounded-sm shadow-2xs select-none">
              ⌘K
            </span>
          </button>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-sm border border-zinc-200 transition-colors cursor-pointer"
                >
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="User" 
                      className="w-6 h-6 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-4 h-4 text-zinc-500" />
                  )}
                  <span className="text-xs font-semibold text-zinc-800">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-sm transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-sm transition-colors focus:outline-none"
            id="mobile-menu-trigger"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="md:hidden border-t border-zinc-200 bg-white px-4 py-4"
            id="mobile-nav-panel"
          >
            <div className="flex flex-col space-y-1.5" id="mobile-nav-links">
              {/* Mobile Calculators Section */}
              <div className="border-b border-zinc-100 pb-2.5 mb-1.5" id="mobile-calculators-section">
                <button
                  onClick={() => setIsMobileCalcsOpen(!isMobileCalcsOpen)}
                  className={`w-full flex items-center justify-between py-2 px-3.5 rounded-sm text-xs font-semibold tracking-wide font-sans transition-colors duration-150 ${
                    isCalculatorsActive
                      ? 'bg-zinc-100 text-zinc-950 font-bold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                  }`}
                  id="mobile-nav-calculators-trigger"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                    Calculators
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileCalcsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMobileCalcsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-1.5 px-1 space-y-1.5"
                      id="mobile-calculators-list"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 py-1">
                        {mobileVisibleCalculators.map((calc) => {
                          const Icon = calcIcons[calc.id] || Percent;
                          const isActive = currentTab === `calculator-${calc.id}`;
                          return (
                            <button
                              key={calc.id}
                              onClick={() => {
                                handleTabClick(`calculator-${calc.id}`);
                              }}
                              className={`flex items-center space-x-2.5 p-2 rounded-sm text-[11px] text-left transition-colors duration-150 ${
                                isActive
                                  ? 'bg-zinc-100 text-zinc-950 font-bold border-l-2 border-zinc-900 pl-2'
                                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="truncate">{calc.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Mobile Show More/Less */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileShowAll(!mobileShowAll);
                        }}
                        className="w-full py-1.5 mt-1 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {mobileShowAll ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <span>Show More (+{calculatorsList.length - 8})</span>
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full text-left py-2 px-3.5 rounded-sm text-xs font-semibold tracking-wide font-sans transition-colors duration-150 ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                    id={`mobile-nav-${item.id}`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="pt-2 mt-2 border-t border-zinc-100">
                {session ? (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/profile');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 rounded-sm transition-colors"
                    >
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt="User" 
                          className="w-8 h-8 rounded-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-5 h-5 text-zinc-500" />
                      )}
                      <span className="text-xs font-semibold text-zinc-800">
                        {session.user?.name || 'User'}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/auth');
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-sm transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

