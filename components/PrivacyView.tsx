import React from 'react';
import { 
  Shield, Lock, Cookie, Scale, 
  Tag, AlertCircle, FileText, Info, Database, Eye, 
  RefreshCw, Globe, Calendar, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CookiePreferenceDropdown from './CookiePreferenceDropdown';

interface PrivacyViewProps {
  cookieSettingsOpen: boolean;
  setCookieSettingsOpen: (val: boolean) => void;
  analyticalCookies: boolean;
  setAnalyticalCookies: (val: boolean) => void;
  marketingCookies: boolean;
  setMarketingCookies: (val: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: (analytics: boolean, marketing: boolean) => void;
  onOpenCookieSettings?: () => void;
}

export default function PrivacyView({ 
  cookieSettingsOpen,
  setCookieSettingsOpen,
  analyticalCookies,
  setAnalyticalCookies,
  marketingCookies,
  setMarketingCookies,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  onOpenCookieSettings,
}: PrivacyViewProps) {
  return (
    <div className="py-12 md:py-20 w-[95%] mx-auto px-4 space-y-12" id="privacy-view-container">
      
      {/* Prominent Header Banner */}
      <div className="text-center space-y-3 mx-auto mb-12 md:mb-16" id="privacy-header">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono block animate-fade-in">
          Data Protection Portal
        </span>
        <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading">
          Privacy Policy
        </h1>
        <p className="text-sm md:text-[14.5px] text-zinc-500 font-sans max-w-2xl mx-auto leading-relaxed">
          At Metricores, mathematical confidentiality is embedded directly into our system architecture. Discover our standard-compliant protocols regarding cookie options, security logs, and sandboxed computing.
        </p>
      </div>

      {/* Content Panel (Centered, single column, full width) */}
      <div className="w-full max-w-full mx-auto bg-white border border-zinc-200 rounded-xl p-6 md:p-10 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] space-y-12" id="privacy-content-panel">
        
        {/* Section 1 */}
        <section id="introduction" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Info className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                1. Introduction & Overview
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Welcome to <strong>Metricores</strong> (referred to herein as "we," "us," or "our"). This website provides modern, elite interactive calculation utilities designed strictly for general academic, professional, and educational finance forecasting.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We operate under a strict philosophy of <strong>mathematical confidentiality</strong>. Because trust is the foundation of high-grade computations, we have engineered this application to maintain the ultimate standards of user privacy. Our platform does not implement secondary profiling layers, unnecessary cloud tracking, or mandatory storage tracking.
            </p>
          </section>

          {/* Section 2 */}
          <section id="collection" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Database className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                2. Information We Collect
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We classify information practices into two primary channels: calculation inputs and standard browser transmission telemetry.
            </p>
            <div className="space-y-2 pt-1">
              <h3 className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider font-sans">
                A. Calculation Inputs (Client-Side Variables)
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
                Metricores does <strong>NOT</strong> collect, read, store, transmit, or audit any numbers, parameters, rates, or values entered into our calculators. All mathematical states operate in temporary local variables.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <h3 className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider font-sans">
                B. Automated Transmission Metadata
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
                When loading our website pages, standard server firewalls temporarily process transmission metadata required for secure TCP/IP connection. This consists of:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
                <li>Internet Protocol (IP) addresses of your connection device.</li>
                <li>Browser software variants and Operating System strings (User-Agent).</li>
                <li>Referring page identifiers and the requested resource URLs.</li>
                <li>General geographic region identifiers (country/state level only).</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="use-information" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Eye className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                3. How We Use Your Information
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Our utilization of information is governed strictly by standard diagnostic limits and legal compliance parameters. We process metadata for the following operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
              <li><strong>Site Defenses:</strong> Real-time security checks, fraud defense, web firewall configuration, and protection against DDOS threats.</li>
              <li><strong>Performance Tuning:</strong> Benchmarking server speeds, diagnosing rendering bottlenecks, and optimizing resource cache performance.</li>
              <li><strong>Contextual Ad Delivery:</strong> Processing general screen dimension indicators to render properly scaled contextual advertisements.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="cookies" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Cookie className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                4. Cookies & Tracking Technologies
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We employ standard web cookies (small text documents deployed to your device) to secure and streamline operations. You can control these settings directly inside your web browser.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider block font-sans">First-Party Cookies</span>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Used exclusively to save platform settings, such as current calculations or visual display themes. These contain zero marketing tracking identifiers.
                </p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider block font-sans">Third-Party Cookies</span>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Placed by standard performance analytic tools and future ad services to analyze basic site interaction behaviors.
                </p>
              </div>
            </div>
            {onOpenCookieSettings && (
              <div className="border border-zinc-200 rounded-xl overflow-hidden mt-4 shadow-3xs" id="cookie-settings-card">
                <div className="bg-zinc-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-bold text-zinc-950 block uppercase tracking-widest font-mono">Cookie Preference Center</span>
                    <p className="text-[11.5px] text-zinc-500 leading-relaxed max-w-xl">
                      Inspect, activate, or revoke consent for specific categories of cookies processed on our platform at any time.
                    </p>
                  </div>
                  <button
                    onClick={() => setCookieSettingsOpen(!cookieSettingsOpen)}
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center py-2.5 px-5 bg-zinc-950 hover:bg-zinc-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-none border border-transparent"
                    id="btn-privacy-toggle-cookies"
                  >
                    {cookieSettingsOpen ? 'Close Settings' : 'Open Settings'}
                  </button>
                </div>
                
                <AnimatePresence initial={false}>
                  {cookieSettingsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-zinc-150"
                    >
                      <CookiePreferenceDropdown
                        analyticalCookies={analyticalCookies}
                        setAnalyticalCookies={setAnalyticalCookies}
                        marketingCookies={marketingCookies}
                        setMarketingCookies={setMarketingCookies}
                        onAcceptAll={onAcceptAll}
                        onRejectAll={onRejectAll}
                        onSavePreferences={onSavePreferences}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Section 5 */}
          <section id="google-analytics" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Shield className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                5. Google Analytics Policy
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Our website utilizes Google Analytics, a secure web evaluation service operated by Google LLC. Google Analytics registers aggregate site trends, visitor sources, click sequences, and device distributions.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              This analytics profile uses IP masking to ensure that your full IP address is anonymized before transmission, preserving absolute privacy. To opt-out of Google Analytics across all active web resources, visit the official Google Opt-Out add-on interface at:{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-zinc-950 font-bold underline inline-flex items-center hover:text-black">
                <span>tools.google.com/dlpage/gaoptout</span>
                <ExternalLink className="w-3 h-3 inline ml-1" />
              </a>.
            </p>
          </section>

          {/* Section 6 */}
          <section id="google-adsense" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Tag className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                6. Google AdSense & Advertising Cookies
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              To support free operations, our platform is engineered to align with Google AdSense and third-party advertising cookie parameters. Please review these operational standards:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
              <li>Third-party networks, including Google, utilize specific cookies to serve ad banners according to previous visits to Metricores or other web channels.</li>
              <li>Google’s deployment of advertising cookies (such as DoubleClick) enables it and associated partner networks to present non-invasive contextual ad frames to visitors.</li>
              <li>You may withdraw personalized marketing options by configuring Google’s Ad Settings at:{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-zinc-950 font-bold underline hover:text-black">
                  adssettings.google.com
                </a>.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="third-party" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <ExternalLink className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                7. Third-Party Services
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We may leverage secure external technology vendors to host files, load system icons, or serve optimized script repositories. These services only ingest general transaction strings necessary to deliver code files. Metricores never permits external vendors to access mathematical calculations or system configurations.
            </p>
          </section>

          {/* Section 8 */}
          <section id="storage-security" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Lock className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                8. Data Storage & Security
              </h2>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 md:p-6 space-y-3">
              <h3 className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">
                Corporate-Grade SSL Security
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
                Metricores runs entirely behind <strong>SSL/TLS (Secure Sockets Layer)</strong> encryption. Your connections, calculations, and inputs are instantly formatted through isolated memory streams that prevent network intercept capabilities.
              </p>
              <p className="text-xs sm:text-[13px] text-zinc-800 font-mono text-[11px] font-bold">
                Because we store zero database files of calculations, there is no system repository for threat actors to target or leak, establishing an absolute structural lock on security.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="user-rights" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Scale className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                9. Your Rights & Privacy Options
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We believe privacy controls should be transparent and easy to execute. Our visitors hold direct sovereign rights regarding their browser environment:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
              <li><strong>Erase Calculator Footprints:</strong> Simply clear your web browser's temporary storage or cookies to immediately purge active calculation parameters.</li>
              <li><strong>Disable Tracking:</strong> Adjust your browser configurations to decline analytical cookies or future contextual ad profiling.</li>
              <li><strong>Do-Not-Track (DNT):</strong> Metricores honors standard browser DNT parameters when loaded.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="coppa" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <FileText className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                10. Children's Privacy (COPPA)
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Consistent with the requirements of the <strong>Children’s Online Privacy Protection Act (COPPA)</strong>, Metricores does not knowingly collect, target, or store any information from individuals under the age of 13.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Our tools, calculators, and educational dashboards are built exclusively for business, academic, and household financial calculations by individuals who are at least 13 years of age. If you believe a minor has loaded cookies on this platform, clearing the browser history will instantly remove all traces of local cookies.
            </p>
          </section>

          {/* Section 11 */}
          <section id="gdpr" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Globe className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                11. GDPR Compliance Standards
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              For visitors operating within the European Economic Area (EEA), we align strictly with the provisions of the General Data Protection Regulation (GDPR). Our legitimate interest in providing firewall diagnostic defenses serves as our legal basis for logging temporary server traffic tags.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Under GDPR, European citizens retain right-to-be-forgotten and access privileges. However, because Metricores maintains zero personal data profiles, customer registries, email address lists, or user calculation database indexes, we cannot execute Data Subject Access Requests (DSAR), as no individual records exist to verify or match.
            </p>
          </section>

          {/* Section 12 */}
          <section id="ccpa" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Scale className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                12. CCPA California Standards
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Under the California Consumer Privacy Act (CCPA), California citizens hold specific rights regarding the commercialization of their data.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
              <li><strong>Data Sale Disclaimer:</strong> Metricores has never sold, leased, or licensed user calculation records, metadata, or browsing history to data monetization entities.</li>
              <li><strong>Equal Opportunity:</strong> We provide identical calculator speeds, display standard features, and layout configurations to all visitors regardless of geographic or privacy choices.</li>
            </ul>
          </section>

          {/* Section 13 */}
          <section id="international" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Globe className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                13. International Users Notice
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Our calculations are accessible worldwide. Because the mathematical state is processed entirely on your local machine, there are no transatlantic transfers of your calculation inputs.
            </p>
          </section>

          {/* Section 14 */}
          <section id="retention" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Calendar className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                14. Data Retention Policy
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We retain standard firewall security logs for a maximum period of 30 days strictly to prevent DDOS and injection attacks. Temporary local variables used in calculations are vaporized instantly when you close your browser tab.
            </p>
          </section>

          {/* Section 15 */}
          <section id="external-links" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <ExternalLink className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                15. External Links Disclaimer
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Our website may contain hyperlinks to external sites, including official government portals and tax agencies. We are not responsible for the privacy practices, tracking methods, or cookie profiles of external domains.
            </p>
          </section>

          {/* Section 16 */}
          <section id="accuracy-disclaimer" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <AlertCircle className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                16. Disclaimer of Accuracy
              </h2>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 md:p-6 space-y-3">
              <div className="flex items-center space-x-2 text-zinc-950 font-bold text-[10px] uppercase tracking-widest font-mono">
                <AlertCircle className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Regulatory Notice</span>
              </div>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Metricores does <strong>NOT</strong> provide certified financial, investment, legal, tax, or banking advice. The calculations, formulas, estimations, mortgage outputs, and interest rates processed on this platform are designed strictly for educational, informational, and academic study.
              </p>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed font-medium">
                We make no representation or warranty regarding the absolute currency or perfection of these calculations. You are strongly advised to consult with a licensed public accountant or financial advisor before making actual commercial, real estate, or banking decisions.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="changes" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <RefreshCw className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                17. Changes to This Privacy Policy
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We reserve the absolute right to revise this policy periodically to maintain alignment with search compliance or regulatory shifts. Any adjustments will be indicated on this page with an updated "Last Updated" and "Effective Date" at the top of the platform page.
            </p>
          </section>

        </div>
    </div>
  );
}
