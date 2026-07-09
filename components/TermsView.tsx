import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, CheckCircle2, FileText, AlertCircle, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';

export default function TermsView() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', label: '1. Acceptance of Terms', icon: ShieldCheck },
    { id: 'services', label: '2. Description of Services', icon: FileText },
    { id: 'disclaimer', label: '3. Financial & Legal Disclaimers', icon: AlertCircle },
    { id: 'conduct', label: '4. Acceptable User Conduct', icon: CheckCircle2 },
    { id: 'intellectual', label: '5. Intellectual Property', icon: Scale },
    { id: 'liability', label: '6. Limitation of Liability', icon: AlertCircle },
    { id: 'revisions', label: '7. Revisions & Updates', icon: RefreshCw },
    { id: 'governing', label: '8. Governing Law', icon: Scale },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const element = document.getElementById(sec.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-12 md:py-20 w-[95%] mx-auto px-4 space-y-12" id="terms-view-container">
      {/* Header Banner */}
      <div className="text-center space-y-3 mx-auto mb-12 md:mb-16" id="terms-header">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono block">
          Legal & Compliance
        </span>
        <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading">
          Terms of Service
        </h1>
        <p className="text-sm md:text-[14.5px] text-zinc-500 font-sans max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before accessing or using Metricores. This document represents a binding legal agreement governing your use of our calculations.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="terms-layout-grid">
        {/* Sticky Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] space-y-4" id="terms-sidebar">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono px-2">
            Table of Contents
          </h2>
          <nav className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm text-left text-[11px] font-semibold transition-all duration-150 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'bg-zinc-950 text-white font-bold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-zinc-100 px-2 space-y-2">
            <h3 className="text-[10px] font-extrabold text-zinc-950 uppercase tracking-widest font-mono">
              Compliance Standard
            </h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              Our terms and privacy documentation have been built in accordance with the Federal Trade Commission (FTC) guidelines, GDPR compliance standards, and Google Publisher Policy benchmarks.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 md:p-10 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] space-y-12" id="terms-content-panel">
          
          {/* Section 1 */}
          <section id="acceptance" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight animate-fade-in">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              By accessing, browsing, or utilizing the website <strong>Metricores</strong> (collectively, the "Service", "Platform", "we", "us", "our"), you signify that you have read, understood, and agreed to be legally bound by these Terms of Service (the "Terms") and our associated Privacy Policy. 
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              If you do not agree with any portion of these Terms, you are strictly prohibited from utilizing the Platform and must cease your use immediately. These terms govern all visitors, developers, corporate users, and general users of Metricores.
            </p>
          </section>

          {/* Section 2 */}
          <section id="services" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <FileText className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                2. Description of Services
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Metricores provides elite, lightweight, responsive, and ad-free interactive calculation engines (the "Calculators") spanning real estate mortgages, business margins, loan amortizations, compound interests, and strategic financial equations.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We reserve the absolute right to modify, suspend, or discontinue any calculator, utility, or part of the Platform at any time without prior notice or liability. All services are offered on an un-metered, open-access basis entirely free of charge.
            </p>
          </section>

          {/* Section 3 */}
          <section id="disclaimer" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <AlertCircle className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                3. Financial & Legal Disclaimers
              </h2>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 md:p-6 space-y-3">
              <h3 className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>CRITICAL REGULATORY NOTICE</span>
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
                Metricores does NOT provide certified financial, legal, tax, or investment advice. The calculations generated by our engines are designed strictly for educational, informational, and academic planning purposes. 
              </p>
              <p className="text-xs sm:text-[13px] text-zinc-800 font-sans leading-relaxed font-semibold">
                Any outputs, estimations, rates, or projections generated by our platform should be verified with a qualified, licensed CPA, financial adviser, tax attorney, or underwriting professional before proceeding with any financial transactions.
              </p>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We make every logical effort to verify our algorithms against academic financial standards, regulatory parameters (such as standard Regulation Z directives), and conventional tax brackets. However, because variables vary across local tax codes, loan options, and bank requirements, Metricores cannot guarantee the completeness or accuracy of any results.
            </p>
          </section>

          {/* Section 4 */}
          <section id="conduct" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                4. Acceptable User Conduct
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              You agree to use Metricores only for lawful purposes. You are strictly prohibited from performing any of the following activities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed">
              <li>Deploying automated scraping scripts, bots, spiders, or extraction engines to crawl our code, parameters, or documentation.</li>
              <li>Launching denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks against our hosting infrastructure.</li>
              <li>Decompiling, reverse-engineering, or copying the proprietary calculation states and mathematical layouts of our calculators.</li>
              <li>Attempting to inject malicious code, scripts, cross-site scripting payloads, or sql variables into our input forms.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="intellectual" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Scale className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                5. Intellectual Property
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              The visual structure, layouts, design palettes, graphics, logos, branding, domain names, mathematical algorithms, client-side formulas, and original article texts hosted on Metricores are the exclusive property of <strong>Metricores Inc.</strong> or our license providers.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              Nothing on the Platform provides you with any license, title, or permission to duplicate, redistribute, or monetize our layout, designs, or proprietary assets. You may link directly to any portion of our site or calculators for educational reference.
            </p>
          </section>

          {/* Section 6 */}
          <section id="liability" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <AlertCircle className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                6. Limitation of Liability
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed font-semibold uppercase tracking-wide">
              METRICORES IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, METRICORES INC. AND ITS OFFICERS, EMPLOYEES, DIRECTORS, OR PARTNERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FIT FOR A PARTICULAR PURPOSE, SYSTEM SECURITY, AND ACCURACY.
            </p>
            <p className="text-xs sm:text-[13px] text-zinc-800 font-sans leading-relaxed font-bold">
              IN NO EVENT SHALL METRICORES INC. BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING COST OVERRUNS, LOST PROFIT ACCRUALS, BUSINESS DISRUPTIONS, OR FINANCIAL MISCALCULATIONS ARISING FROM THE USE OF OUR TOOLS.
            </p>
          </section>

          {/* Section 7 */}
          <section id="revisions" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <RefreshCw className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                7. Revisions & Updates
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              We reserve the absolute right to revise, update, or replace these Terms at any time. When we make substantial updates, we will revise the "Effective Date" at the top of this document. It is your sole responsibility to check these Terms periodically for updates. Continued use of the website following changes implies binding acceptance.
            </p>
          </section>

          {/* Section 8 */}
          <section id="governing" className="scroll-mt-24 space-y-4">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-3">
              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800 shrink-0">
                <Scale className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                8. Governing Law
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
              These Terms of Service and any dispute, claim, or transaction arising from your use of the Platform shall be governed by and construed in accordance with the laws of the State of California, United States, without giving effect to conflicts of laws principles.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
