import React from 'react';
import { Target, Eye, Zap, Heart, Users, CheckCircle } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="py-12 md:py-20 w-[95%] mx-auto px-4 space-y-16" id="about-view-container">
      {/* Header */}
      <div className="text-center space-y-3 mx-auto" id="about-header">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono block">
          About Metricores
        </span>
        <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading">
          Built for Mathematical Precision
        </h1>
        <p className="text-sm md:text-[14.5px] text-zinc-500 font-sans leading-relaxed mx-auto">
          The globally trusted portal for immediate, ad-free business calculators. We optimize for elite calculation speed and verified mathematical compliance.
        </p>
      </div>

      {/* Grid: Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto" id="about-mission-vision">
        {/* Mission Card */}
        <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-300 space-y-4 flex flex-col justify-between" id="about-mission-card">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800">
              <Target className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
              Our Mission
            </h2>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              To provide professionals, entrepreneurs, and individuals with pristine, commercial-grade calculation engines. We replace heavy, chaotic, ad-bloated sheets with simple, responsive web elements that complete financial equations instantly.
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-300 space-y-4 flex flex-col justify-between" id="about-vision-card">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800">
              <Eye className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
              Our Vision
            </h2>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              We envision a clean, highly functional web where financial planning utilities are accessible globally without barriers. Metricores strives to be the standard reference portal for verifiable mathematical calculations in real estate, business, and taxation.
            </p>
          </div>
        </div>
      </div>

      {/* Why Metricores Section */}
      <div className="space-y-8 mx-auto" id="about-why-metricores">
        <div className="border-t border-zinc-200 pt-12 text-center md:text-left">
          <h2 className="text-xl font-bold text-zinc-950 font-sans tracking-tight flex items-center justify-center md:justify-start space-x-2.5">
            <Zap className="w-5 h-5 text-zinc-800" />
            <span>Why Metricores</span>
          </h2>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono uppercase tracking-wider">
            An honest look at our architectural advantages.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8" id="why-metricores-grid">
          <div className="space-y-2 border-l border-zinc-150 pl-5" id="why-pure-math">
            <h3 className="text-[11px] font-extrabold text-zinc-950 uppercase font-mono tracking-widest">
              1. Pure Compliance
            </h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Our formulas align with banking standards (Regulation Z) and corporate financial frameworks. We verify our algorithms against trusted academic standards.
            </p>
          </div>
          <div className="space-y-2 border-l border-zinc-150 pl-5" id="why-zero-ad-clutter">
            <h3 className="text-[11px] font-extrabold text-zinc-950 uppercase font-mono tracking-widest">
              2. Zero Ad Clutter
            </h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              We never host flashy ad banners, pop-ups, or cookie tracking databases. You receive a premium corporate focus environment optimized for executive planning.
            </p>
          </div>
          <div className="space-y-2 border-l border-zinc-150 pl-5" id="why-elite-byte-speed">
            <h3 className="text-[11px] font-extrabold text-zinc-950 uppercase font-mono tracking-widest">
              3. Elite Byte Speed
            </h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Metricores uses a customized build profile to minimize download weight. No heavy, uncompressed libraries or third-party analytic delays.
            </p>
          </div>
        </div>
      </div>

      {/* Who It's For Section */}
      <div className="space-y-8 border-t border-zinc-200 pt-12 mx-auto" id="about-who-its-for">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-zinc-950 font-sans tracking-tight flex items-center justify-center md:justify-start space-x-2.5">
            <Users className="w-5 h-5 text-zinc-800" />
            <span>Who It's For</span>
          </h2>
          <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
            Who gets the most out of our mathematical engines.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5" id="who-grid">
          <div className="bg-white p-6 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all duration-200 space-y-2" id="who-entrepreneurs">
            <h3 className="text-[11.5px] font-bold text-zinc-950 uppercase tracking-wider font-sans">Entrepreneurs</h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-1">To verify margins, markups, and project annualized ROI accurately before proposing sales ventures.</p>
          </div>
          <div className="bg-white p-6 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all duration-200 space-y-2" id="who-homeowners">
            <h3 className="text-[11.5px] font-bold text-zinc-950 uppercase tracking-wider font-sans">Homeowners</h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-1">To calculate monthly mortgage payments, extra amortizations, and long-term interest trends easily.</p>
          </div>
          <div className="bg-white p-6 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all duration-200 space-y-2" id="who-financiers">
            <h3 className="text-[11.5px] font-bold text-zinc-950 uppercase tracking-wider font-sans">Financiers</h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-1">To structure loans, project compound interests, and analyze loan-to-value ratios instantly.</p>
          </div>
          <div className="bg-white p-6 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all duration-200 space-y-2" id="who-execs">
            <h3 className="text-[11.5px] font-bold text-zinc-950 uppercase tracking-wider font-sans">Executives</h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-1">To review taxation bracket details and verify complex operational metrics on high-level briefings.</p>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="space-y-8 border-t border-zinc-200 pt-12 mx-auto" id="about-values-section">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-zinc-950 font-sans tracking-tight flex items-center justify-center md:justify-start space-x-2.5">
            <Heart className="w-5 h-5 text-zinc-800" />
            <span>Our Values</span>
          </h2>
          <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
            The principles guiding our code, formulas, and user experiences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" id="values-grid">
          <div className="flex items-start space-x-4 bg-zinc-50 p-6 rounded-xl border border-zinc-200/60" id="value-item-honesty">
            <CheckCircle className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-950 font-sans">Absolute Transparency</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                No hidden costs, sign-up forms, or premium features locked behind paywalls. We are fully transparent about our code and calculation formulas.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-zinc-50 p-6 rounded-xl border border-zinc-200/60" id="value-item-integrity">
            <CheckCircle className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-950 font-sans">Data Privacy First</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                We believe your financial inquiries are yours alone. Metricores does not record, track, store, or sell any parameter inputs you enter into our system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
