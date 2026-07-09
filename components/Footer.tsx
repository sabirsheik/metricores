interface FooterProps {
  onChangeTab: (tab: string) => void;
}

export default function Footer({ onChangeTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-zinc-200/60 bg-white transition-colors duration-200 py-12 md:py-16 print:hidden"
      id="site-footer"
    >
      <div className="max-w-[95%] w-[95%] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12" id="footer-container">
        {/* Logo and Tagline (4 Columns) */}
        <div className="md:col-span-4 space-y-4" id="footer-branding">
          <button
            onClick={() => onChangeTab('home')}
            className="flex items-center text-zinc-900 font-heading font-bold text-base tracking-tight select-none focus:outline-none focus:ring-1 focus:ring-zinc-950/10 rounded-sm cursor-pointer"
            id="footer-brand-logo"
          >
            <span className="inline-flex w-8 h-8 rounded-xl bg-zinc-950 items-center justify-center text-white text-sm font-mono font-bold tracking-tighter shadow-sm">
              M
            </span>
            <span className="font-semibold text-zinc-900 ml-3">Metricores</span>
          </button>
          <p className="text-xs text-zinc-500 font-sans leading-relaxed max-w-sm">
            Metricores delivers enterprise-grade business calculators designed for elite pricing accuracy, personal tax estimation, and commercial real estate projections. Simple, fast, and completely free.
          </p>
        </div>

        {/* Links Column 1: Calculators (3 Columns) */}
        <div className="md:col-span-3 space-y-3" id="footer-col-calculators">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
            Popular Utilities
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-500 font-sans" id="footer-calculators-list">
            <li>
              <button
                onClick={() => onChangeTab('calculator-mortgage')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Mortgage Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => onChangeTab('calculator-loan')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Loan Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => onChangeTab('calculator-profit-margin')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Profit Margin Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => onChangeTab('calculator-roi')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                ROI Calculator
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Platform (2 Columns) */}
        <div className="md:col-span-2 space-y-3" id="footer-col-platform">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
            Platform
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-500 font-sans" id="footer-platform-list">
            <li>
              <button
                onClick={() => onChangeTab('home')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => onChangeTab('guides')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Guides & Articles
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Corporate (3 Columns) */}
        <div className="md:col-span-3 space-y-3" id="footer-col-corporate">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
            Company
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-500 font-sans" id="footer-company-list">
            <li>
              <button
                onClick={() => onChangeTab('about')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                About Metricores
              </button>
            </li>
            <li>
              <button
                onClick={() => onChangeTab('faq')}
                className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li className="text-xs text-zinc-400 leading-normal max-w-xs" id="footer-compliance-detail">
              Metricores provides analytical tools for informative and academic planning. No real estate or banking decisions should be finalized without seeking legal counsel.
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright row */}
      <div className="max-w-[95%] w-[95%] mx-auto px-4 md:px-6 pt-10 mt-10 border-t border-zinc-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-sans" id="footer-copyright-row">
        <span>
          © {currentYear} Metricores Inc. All rights reserved worldwide.
        </span>
        <div className="flex items-center space-x-4 text-xs text-zinc-400 font-sans" id="footer-legal-links">
          <button
            onClick={() => onChangeTab('privacy')}
            className="hover:text-zinc-600 transition-colors cursor-pointer focus:outline-none"
          >
            Privacy Policy
          </button>
          <span className="text-zinc-300">|</span>
          <button
            onClick={() => onChangeTab('terms')}
            className="hover:text-zinc-600 transition-colors cursor-pointer focus:outline-none"
          >
            Terms of Service
          </button>
          <span className="text-zinc-300">|</span>
          <button
            onClick={() => onChangeTab('faq')}
            className="hover:text-zinc-600 transition-colors cursor-pointer focus:outline-none"
          >
            FAQ
          </button>
        </div>
      </div>
    </footer>
  );
}
