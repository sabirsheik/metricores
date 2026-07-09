import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Zap,
  CheckCircle,
  Award,
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  DollarSign,
  Home as HomeIcon,
  Briefcase,
  TrendingUp,
  Layers,
  Percent,
  Coins,
  ShieldCheck,
  Scale,
  ChevronRight,
  FileText,
  CreditCard,
  User,
  Shield,
  HelpCircle
} from 'lucide-react';
import { calculatorsData } from '@/data/calculators';
import { calcIcons } from './CalculatorView';
import { guidesData } from '@/data/guides';

interface HomeViewProps {
  onNavigateToTab: (tab: string) => void;
  onNavigateToCalculator: (id: string) => void;
  onNavigateToGuide: (id: string) => void;
}

// Map custom gradients for the iOS/Desmos-style squircles
const iconGradients: Record<string, string> = {
  mortgage: 'from-emerald-400 to-teal-500 shadow-teal-100/60',
  loan: 'from-blue-400 to-indigo-500 shadow-blue-100/60',
  tax: 'from-violet-400 to-purple-500 shadow-purple-100/60',
  interest: 'from-rose-400 to-pink-500 shadow-pink-100/60',
  payment: 'from-amber-400 to-orange-500 shadow-orange-100/60',
  time: 'from-sky-400 to-cyan-500 shadow-cyan-100/60',
  'profit-margin': 'from-red-400 to-rose-500 shadow-rose-100/60',
  roi: 'from-fuchsia-400 to-violet-500 shadow-violet-100/60',
  percentage: 'from-indigo-400 to-blue-500 shadow-indigo-100/60',
  discount: 'from-amber-500 to-orange-600 shadow-orange-100/60',
  tip: 'from-yellow-400 to-amber-500 shadow-amber-100/60',
  vat: 'from-emerald-500 to-green-600 shadow-emerald-100/60',
};

// Map labels and descriptions for the app-like tools
const toolDisplayData: Record<string, { label: string; tag?: string }> = {
  mortgage: { label: 'Mortgage' },
  loan: { label: 'Amortize' },
  tax: { label: 'Income Tax', tag: 'UPDATED' },
  interest: { label: 'Compound' },
  payment: { label: 'Debt Payoff' },
  time: { label: 'Date Calc' },
  'profit-margin': { label: 'Margins', tag: 'BETA' },
  roi: { label: 'ROI' },
  percentage: { label: 'Percentages' },
  discount: { label: 'Discounts' },
  tip: { label: 'Tip Split' },
  vat: { label: 'VAT Tax' },
};

export default function HomeView({
  onNavigateToTab,
  onNavigateToCalculator,
  onNavigateToGuide
}: HomeViewProps) {
  // Sandbox State 1: Growth Modeler
  const [heroGrowthRate, setHeroGrowthRate] = useState(8);
  const [heroYears, setHeroYears] = useState(30);
  const [heroPrincipal] = useState(10000);

  // Sandbox State 2: Margin / Markup
  const [marginCost, setMarginCost] = useState(60);
  const [marginTarget, setMarginTarget] = useState(40);

  // Sandbox State 3: Amortization
  const [amortRate, setAmortRate] = useState(6.5);
  const [amortTerm, setAmortTerm] = useState(30); // 15 or 30

  // Sandbox State 4: Progressive Tax
  const [taxIncome, setTaxIncome] = useState(95000);

  // 8 calculators list
  const calcsList = Object.values(calculatorsData);

  // 1. Math formulas for Hero Compound growth modeler
  const heroGrowthPoints = useMemo(() => {
    const points: { x: number; y: number; balance: number }[] = [];
    const r = heroGrowthRate / 100;
    const P = heroPrincipal;
    const monthlyContribution = 200; // Fixed contribution

    for (let yr = 0; yr <= heroYears; yr++) {
      // Future value of lump sum + Future value of annuity
      const rateFactor = Math.pow(1 + r, yr);
      const annuityFactor = r === 0 ? yr : (Math.pow(1 + r, yr) - 1) / r;
      const balance = P * rateFactor + (monthlyContribution * 12) * annuityFactor;
      points.push({ x: yr, y: balance, balance });
    }
    return points;
  }, [heroGrowthRate, heroYears, heroPrincipal]);

  const maxBalance = heroGrowthPoints[heroGrowthPoints.length - 1]?.balance || 100000;

  // Render SVG path for Hero growth curve
  const heroSvgPath = useMemo(() => {
    if (heroGrowthPoints.length === 0) return '';
    const width = 340;
    const height = 150;
    const padding = 15;

    const coords = heroGrowthPoints.map((pt, i) => {
      const xRatio = i / (heroGrowthPoints.length - 1);
      const yRatio = pt.balance / maxBalance;
      const x = padding + xRatio * (width - padding * 2);
      const y = height - padding - yRatio * (height - padding * 2);
      return { x, y };
    });

    return coords.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic bezier curves
      const prev = coords[idx - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }, '');
  }, [heroGrowthPoints, maxBalance]);

  // 2. Margin Math
  const marginResults = useMemo(() => {
    const cost = marginCost;
    const target = marginTarget / 100;
    const sellingPrice = target === 1 ? cost : cost / (1 - target);
    const grossProfit = Math.max(0, sellingPrice - cost);
    const markup = cost === 0 ? 0 : (grossProfit / cost) * 100;
    return {
      sellingPrice,
      grossProfit,
      markup
    };
  }, [marginCost, marginTarget]);

  // 3. Amortization Math (cumulative Principal vs Interest paid over term)
  const amortizationPoints = useMemo(() => {
    const termMonths = amortTerm * 12;
    const loanAmount = 300000;
    const monthlyRate = (amortRate / 100) / 12;
    const monthlyPayment = monthlyRate === 0 
      ? loanAmount / termMonths 
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);

    const points: { year: number; principal: number; interest: number }[] = [];
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;
    let balance = loanAmount;

    for (let m = 1; m <= termMonths; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(balance, monthlyPayment - interestPayment);
      balance -= principalPayment;
      cumulativePrincipal += principalPayment;
      cumulativeInterest += interestPayment;

      if (m % 12 === 0 || m === termMonths) {
        points.push({
          year: Math.ceil(m / 12),
          principal: cumulativePrincipal,
          interest: cumulativeInterest
        });
      }
    }
    return points;
  }, [amortRate, amortTerm]);

  const maxCumulative = useMemo(() => {
    if (amortizationPoints.length === 0) return 400000;
    const last = amortizationPoints[amortizationPoints.length - 1];
    return last.principal + last.interest;
  }, [amortizationPoints]);

  const crossoverYear = useMemo(() => {
    // Find first year principal paid exceeds interest paid
    const match = amortizationPoints.find(p => p.principal > p.interest);
    return match ? match.year : null;
  }, [amortizationPoints]);

  // 4. Progressive Tax Math
  const taxProgressiveData = useMemo(() => {
    // 2026 progressive federal tax bracket simplified
    const brackets = [
      { rate: 0.10, limit: 11600 },
      { rate: 0.12, limit: 47150 },
      { rate: 0.22, limit: 100525 },
      { rate: 0.24, limit: 191950 },
      { rate: 0.32, limit: 243725 }
    ];

    let remaining = taxIncome;
    let totalTax = 0;
    let prevLimit = 0;
    const breakdowns = brackets.map((b) => {
      const range = b.limit - prevLimit;
      const taxableInBracket = Math.min(range, Math.max(0, remaining));
      const taxInBracket = taxableInBracket * b.rate;
      totalTax += taxInBracket;
      remaining -= taxableInBracket;

      const fillRatio = taxableInBracket / range;
      const displayLabel = `${Math.round(b.rate * 100)}%`;
      const caption = `$${(prevLimit / 1000).toFixed(0)}k–$${(b.limit / 1000).toFixed(0)}k`;
      prevLimit = b.limit;

      return {
        label: displayLabel,
        caption,
        taxable: taxableInBracket,
        tax: taxInBracket,
        fillRatio
      };
    });

    const effectiveRate = taxIncome === 0 ? 0 : (totalTax / taxIncome) * 100;
    return {
      breakdowns,
      totalTax,
      effectiveRate
    };
  }, [taxIncome]);

  return (
    <div className="bg-zinc-50/30 min-h-screen" id="home-root">
      {/* 1. HERO BANNER - EXECUTIVE DARK GRID HEADER */}
      <div className="relative bg-zinc-950 text-white overflow-hidden pb-20 sm:pb-28 md:pb-36 pt-16 md:pt-20" id="hero-banner">
        {/* Decorative structural grid background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-[95%] w-[95%] mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center" id="hero-layout">
            
            {/* Left Column: Hero Text */}
            <div className="space-y-6 lg:col-span-7 text-left" id="hero-text-content">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
                Beautiful <br />
                <span className="text-zinc-400">
                  computational math.
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-sans max-w-xl leading-relaxed">
                At Metricores, we believe modeling equations, geometry proportions, compound percentages, and practical calculations should be elegant, interactive, and perfectly precise. No ad networks, no tracking, just pure mathematics.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2" id="hero-ctas">
                <button
                  onClick={() => onNavigateToTab('calculators/graphing')}
                  className="w-full sm:w-auto py-3 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-sans text-xs font-semibold rounded-sm transition-all duration-150 active:scale-[0.98] shadow-2xs cursor-pointer flex items-center justify-center border border-zinc-200"
                  id="hero-cta-explore"
                >
                  Open Graphing Calculator
                  <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => onNavigateToTab('guides')}
                  className="w-full sm:w-auto py-3 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-sans text-xs font-semibold rounded-sm transition-all duration-150 cursor-pointer flex items-center justify-center"
                  id="hero-cta-guides"
                >
                  Read Strategy Guides
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Graph Modeler Card (Desmos Graphing mockup) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end" id="hero-interactive-graph">
              <div className="w-full max-w-[390px] bg-zinc-950 border border-zinc-800 shadow-xl rounded-sm p-5 text-white transition-all duration-300 select-none relative" id="hero-modeler-card">
                {/* Mini card head */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-zinc-900 border border-zinc-850 rounded-sm flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 font-sans tracking-tight">Compound Wealth Graph</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-sm uppercase tracking-wider">Live Preview</span>
                </div>

                {/* SVG Visual Compound Chart */}
                <div className="relative h-[150px] bg-zinc-900/50 border border-zinc-800 rounded-sm overflow-hidden mb-4" id="hero-chart-display">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 340 150">
                    {/* Gridlines */}
                    <line x1="15" y1="135" x2="325" y2="135" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="15" y1="15" x2="15" y2="135" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="170" y1="15" x2="170" y2="135" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="325" y1="15" x2="325" y2="135" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Gradient fill */}
                    <defs>
                      <linearGradient id="growth-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill path under curve */}
                    {heroGrowthPoints.length > 0 && (
                      <path
                        d={`${heroSvgPath} L ${15 + (1) * (340 - 30)} 135 L 15 135 Z`}
                        fill="url(#growth-gradient)"
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Curve path */}
                    <path
                      d={heroSvgPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    {/* Endpoint dot with pulse indicator */}
                    {heroGrowthPoints.length > 0 && (() => {
                      const x = 15 + (1) * (340 - 30);
                      const y = 150 - 15 - (heroGrowthPoints[heroGrowthPoints.length - 1].balance / maxBalance) * (150 - 30);
                      return (
                        <g>
                          <circle cx={x} cy={y} r="8" fill="#ffffff" fillOpacity="0.1" className="animate-ping" />
                          <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Absolute value bubble */}
                  <div className="absolute right-3.5 top-3.5 bg-zinc-950 px-2.5 py-1 rounded-sm border border-zinc-800 text-white font-mono text-xs space-y-0.5 shadow-sm">
                    <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-semibold">FINAL VALUE ({heroYears} Yr)</span>
                    <span className="font-extrabold text-zinc-100">
                      ${Math.round(maxBalance).toLocaleString()}
                    </span>
                  </div>

                  <span className="absolute bottom-2 left-3.5 text-[9px] text-zinc-500 font-mono tracking-wider uppercase font-medium">Use controls below to configure</span>
                </div>

                {/* Real-time Interactive Sliders */}
                <div className="space-y-3.5" id="hero-modeler-sliders">
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-bold text-zinc-300 mb-1">
                      <span>Annual Return (Interest)</span>
                      <span className="text-zinc-100 font-mono">{heroGrowthRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={heroGrowthRate}
                      onChange={(e) => setHeroGrowthRate(parseFloat(e.target.value))}
                      className="w-full accent-zinc-100 h-1 bg-zinc-800 rounded-sm appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-bold text-zinc-300 mb-1">
                      <span>Compounding Horizon</span>
                      <span className="text-zinc-100 font-mono">{heroYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={heroYears}
                      onChange={(e) => setHeroYears(parseInt(e.target.value))}
                      className="w-full accent-zinc-100 h-1 bg-zinc-800 rounded-sm appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToCalculator('interest')}
                  className="w-full mt-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold rounded-sm font-sans flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>Start Growth Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Custom wavy border at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] pointer-events-none" id="wave-bottom">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[40px] sm:h-[80px] md:h-[120px] fill-[#FAFAFA]"
          >
            <path d="M0,90 C120,90 160,30 280,30 C400,30 480,85 600,85 C700,85 740,40 840,40 C940,40 1000,110 1100,110 C1200,110 1240,25 1340,25 C1400,25 1420,80 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-[95%] w-[95%] mx-auto px-4 md:px-6 py-12 space-y-24 md:space-y-32" id="home-main-content">
        
        {/* 2. EXPLORE OUR CALCULATOR SUITE - BENTO-STYLE TOOL TILES */}
        <section className="space-y-8" id="app-squircles-section">
          <div className="text-center max-w-xl mx-auto space-y-2.5" id="squircles-header">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono block">
              Computational Dashboard
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-black text-zinc-950 font-heading tracking-tight">
              Explore Computational Suites
            </h2>
            <p className="text-sm text-zinc-500 font-sans leading-relaxed">
              Access our clean, high-fidelity mathematical tools immediately by clicking below.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5 justify-center max-w-6xl mx-auto" id="squircles-grid">
            {calcsList.map((calc) => {
              const CardIcon = calcIcons[calc.id] || Zap;
              const display = toolDisplayData[calc.id] || { label: calc.name };

              return (
                <div
                  key={calc.id}
                  onClick={() => onNavigateToCalculator(calc.id)}
                  className="flex flex-col items-center justify-between text-center p-6 min-h-[175px] rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06),0_4px_12px_-4px_rgba(0,0,0,0.02)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer group select-none relative"
                  id={`squircle-item-${calc.id}`}
                >
                  {/* Elegant centered micro tile container */}
                  <div className="relative flex items-center justify-center w-full pt-1.5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-800 group-hover:bg-zinc-100 group-hover:text-zinc-950 transition-all duration-200 shadow-3xs">
                      <CardIcon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    {/* Centered Black Beta/Updated tag */}
                    {display.tag && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-[8px] font-extrabold tracking-widest text-white rounded-xs uppercase font-mono shadow-xs select-none">
                        {display.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-3 w-full">
                    <span className="text-sm font-bold text-zinc-950 font-sans tracking-tight leading-snug group-hover:text-black block">
                      {display.label}
                    </span>
                    <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block font-mono">
                      {calc.category.replace(' Mathematics', '')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. PRODUCT SHOWCASE 1: MARGIN / MARKUP WORKSPACE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" id="showcase-margins">
          {/* Left Side: Live Sandbox Widget */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center" id="showcase-margins-widget">
            <div className="w-full max-w-[440px] bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs relative overflow-hidden" id="markup-sandbox-card">
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-900">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800 font-sans">Margin & Markup Modeling</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 rounded-sm uppercase">Live Compute</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5" id="margin-input-rows">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Unit Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">$</span>
                    <input
                      type="number"
                      value={marginCost}
                      onChange={(e) => setMarginCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full py-1.5 pl-7 pr-2.5 bg-white border border-zinc-200 text-xs rounded-sm text-zinc-900 font-mono focus:outline-none shadow-2xs"
                    />
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={marginCost}
                    onChange={(e) => setMarginCost(parseInt(e.target.value))}
                    className="w-full accent-zinc-950 h-1 mt-2.5 block cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Target Margin</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">%</span>
                    <input
                      type="number"
                      value={marginTarget}
                      onChange={(e) => setMarginTarget(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full py-1.5 pl-3 pr-7 bg-white border border-zinc-200 text-xs rounded-sm text-zinc-900 font-mono focus:outline-none shadow-2xs"
                    />
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={marginTarget}
                    onChange={(e) => setMarginTarget(parseInt(e.target.value))}
                    className="w-full accent-zinc-950 h-1 mt-2.5 block cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic Stacked Bar Chart of Cost vs Profit Wedge */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm space-y-3.5 shadow-2xs" id="margin-visualizer-bar">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-700 font-sans">Price Structure Allocation</span>
                  <span className="font-mono text-zinc-500 text-xs">Selling Price: <strong className="text-zinc-900 font-extrabold">${marginResults.sellingPrice.toFixed(2)}</strong></span>
                </div>

                {/* Stacked Percentage Bar */}
                <div className="h-6 w-full bg-zinc-200 rounded-sm overflow-hidden flex" id="pricing-bars">
                  {/* Cost Bar */}
                  <div
                    style={{ width: `${(marginCost / marginResults.sellingPrice) * 100}%` }}
                    className="h-full bg-zinc-400 flex items-center justify-center text-white text-[11px] font-bold font-mono transition-all duration-300 relative group"
                  >
                    <span className="truncate px-1">Cost: ${(marginCost).toFixed(0)}</span>
                  </div>
                  {/* Profit Bar */}
                  <div
                    style={{ width: `${marginTarget}%` }}
                    className="h-full bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono transition-all duration-300"
                  >
                    <span className="truncate px-1">Profit: ${(marginResults.grossProfit).toFixed(0)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1.5" id="margin-outputs">
                  <div className="bg-white border border-zinc-200 p-2 rounded-sm shadow-2xs">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block font-sans">Gross Profit</span>
                    <span className="text-xs font-extrabold text-zinc-950 font-mono">${marginResults.grossProfit.toFixed(2)}</span>
                  </div>
                  <div className="bg-white border border-zinc-200 p-2 rounded-sm shadow-2xs">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block font-sans">Markup %</span>
                    <span className="text-xs font-extrabold text-zinc-950 font-mono">{marginResults.markup.toFixed(1)}%</span>
                  </div>
                  <div className="bg-white border border-zinc-200 p-2 rounded-sm shadow-2xs">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block font-sans">Cost Ratio</span>
                    <span className="text-xs font-extrabold text-zinc-950 font-mono">{Math.round((marginCost / marginResults.sellingPrice) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4" id="margin-links">
                <button
                  onClick={() => onNavigateToCalculator('profit-margin')}
                  className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-semibold rounded-sm font-sans text-center transition-all cursor-pointer"
                >
                  Open Margins Tool
                </button>
                <button
                  onClick={() => onNavigateToGuide('retail-pricing')}
                  className="py-2 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-700 text-xs font-semibold rounded-sm font-sans text-center transition-all cursor-pointer"
                >
                  Read Formula
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left" id="showcase-margins-copy">
            <div className="w-8 h-8 bg-zinc-50 border border-zinc-200/50 rounded-sm flex items-center justify-center text-zinc-900">
              <Scale className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading leading-tight tracking-tight">
              One dashboard. All your profit metrics.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
              Never mix up markups and margins again. With our dynamic profit calculation cards, you can evaluate cost structure allocations, visualize the profit markup margin ratio, and instantly understand pricing variables. Put standard variables into immediate action or run advanced enterprise COGS configurations.
            </p>
            <div className="flex items-center space-x-4 pt-1" id="showcase-margins-bullets">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Unified ratios</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Interactive markup</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>COGS calculation</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT SHOWCASE 2: AMORTIZATION SCHEDULE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" id="showcase-amort">
          {/* Left Side: Copy */}
          <div className="lg:col-span-6 space-y-5 text-left" id="showcase-amort-copy">
            <div className="w-8 h-8 bg-zinc-50 border border-zinc-200/50 rounded-sm flex items-center justify-center text-zinc-900">
              <HomeIcon className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading leading-tight tracking-tight">
              The next generation of amortization analysis.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
              Mortgage schedules aren't just flat lists of interest payments. Our visual amortization tool maps out cumulative principal payoff curves alongside decreasing interest loads in beautiful, high-contrast graphs. Track the exact crossover point where your monthly equity starts outpacing debt fee payments.
            </p>
            <div className="flex gap-3" id="showcase-amort-links">
              <button
                onClick={() => onNavigateToCalculator('mortgage')}
                className="py-2 px-4 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-semibold rounded-sm font-sans transition-all cursor-pointer"
              >
                Open Mortgage Tool
              </button>
              <button
                onClick={() => onNavigateToCalculator('loan')}
                className="py-2 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-sm font-sans transition-all cursor-pointer"
              >
                Amortization Tool
              </button>
            </div>
          </div>

          {/* Right Side: Live Sandbox Widget */}
          <div className="lg:col-span-6 flex justify-center" id="showcase-amort-widget">
            <div className="w-full max-w-[440px] bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs relative overflow-hidden" id="amort-sandbox-card">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-900">
                    <HomeIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800 font-sans">Amortization Curve Modeling</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 rounded-sm uppercase">Cumulative Graph</span>
              </div>

              {/* Slider for Term & Rate */}
              <div className="grid grid-cols-2 gap-4 mb-4" id="amort-sandbox-sliders">
                <div>
                  <div className="flex justify-between items-center text-xs font-sans font-bold text-zinc-500 mb-1">
                    <span>INTEREST RATE</span>
                    <span className="text-zinc-950 font-mono">{amortRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.1"
                    value={amortRate}
                    onChange={(e) => setAmortRate(parseFloat(e.target.value))}
                    className="w-full accent-zinc-950 h-1 bg-zinc-100 rounded-sm appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-sans font-bold text-zinc-500 mb-1">
                    <span>TERM HORIZON</span>
                    <span className="text-zinc-950 font-sans uppercase font-black">{amortTerm} Yr</span>
                  </div>
                  <div className="flex bg-zinc-50 border border-zinc-200 p-0.5 rounded-sm h-6 items-center">
                    <button
                      onClick={() => setAmortTerm(15)}
                      className={`flex-1 text-xs font-bold font-sans py-0.5 text-center rounded-sm transition-all focus:outline-none ${amortTerm === 15 ? 'bg-white border border-zinc-250 text-zinc-950 shadow-2xs font-extrabold' : 'text-zinc-500'}`}
                    >
                      15 Yr
                    </button>
                    <button
                      onClick={() => setAmortTerm(30)}
                      className={`flex-1 text-xs font-bold font-sans py-0.5 text-center rounded-sm transition-all focus:outline-none ${amortTerm === 30 ? 'bg-white border border-zinc-250 text-zinc-950 shadow-2xs font-extrabold' : 'text-zinc-500'}`}
                    >
                      30 Yr
                    </button>
                  </div>
                </div>
              </div>

              {/* Area SVG display */}
              <div className="relative h-[140px] bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden mb-4 shadow-2xs" id="amort-svg-display">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 340 140">
                  <line x1="15" y1="125" x2="325" y2="125" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="15" y1="15" x2="15" y2="125" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Draw cumulative Interest area in slate-400 */}
                  {/* Draw cumulative Principal area in black */}
                  <defs>
                    <linearGradient id="interest-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#71717a" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="principal-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#09090b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Cumulative Interest Area Fill & Path */}
                  {(() => {
                    const width = 340;
                    const height = 140;
                    const padding = 15;
                    const coords = amortizationPoints.map((pt, i) => {
                      const xRatio = i / (amortizationPoints.length - 1);
                      const yRatio = pt.interest / maxCumulative;
                      const x = padding + xRatio * (width - padding * 2);
                      const y = height - padding - yRatio * (height - padding * 2);
                      return { x, y };
                    });
                    const d = coords.reduce((acc, curr, idx) => {
                      if (idx === 0) return `M ${curr.x} ${curr.y}`;
                      return `${acc} L ${curr.x} ${curr.y}`;
                    }, '');
                    return (
                      <g>
                        <path d={`${d} L 325 125 L 15 125 Z`} fill="url(#interest-grad)" className="transition-all duration-300" />
                        <path d={d} fill="none" stroke="#71717a" strokeWidth="2" className="transition-all duration-300" />
                      </g>
                    );
                  })()}

                  {/* Cumulative Principal Area Fill & Path */}
                  {(() => {
                    const width = 340;
                    const height = 140;
                    const padding = 15;
                    const coords = amortizationPoints.map((pt, i) => {
                      const xRatio = i / (amortizationPoints.length - 1);
                      const yRatio = pt.principal / maxCumulative;
                      const x = padding + xRatio * (width - padding * 2);
                      const y = height - padding - yRatio * (height - padding * 2);
                      return { x, y };
                    });
                    const d = coords.reduce((acc, curr, idx) => {
                      if (idx === 0) return `M ${curr.x} ${curr.y}`;
                      return `${acc} L ${curr.x} ${curr.y}`;
                    }, '');
                    return (
                      <g>
                        <path d={`${d} L 325 125 L 15 125 Z`} fill="url(#principal-grad)" className="transition-all duration-300" />
                        <path d={d} fill="none" stroke="#09090b" strokeWidth="2.5" className="transition-all duration-300" />
                      </g>
                    );
                  })()}
                </svg>
                {/* Legend Overlay */}
                <div className="absolute right-3.5 top-3.5 flex flex-col space-y-1 bg-white border border-zinc-200 px-2.5 py-1.5 rounded-sm text-[10px] font-sans shadow-2xs">
                  <div className="flex items-center space-x-1.5 font-bold text-zinc-700">
                    <span className="w-2.5 h-1 bg-[#09090b] rounded-xs" />
                    <span>Equity (Principal) Paid</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-bold text-zinc-700">
                    <span className="w-2.5 h-1 bg-[#71717a] rounded-xs" />
                    <span>Debt Fee (Interest) Paid</span>
                  </div>
                </div>

                {/* Crossover badge */}
                {crossoverYear && (
                  <div className="absolute left-3.5 bottom-2 bg-zinc-950 text-white font-mono text-[9px] px-2 py-0.5 rounded-sm border border-zinc-800">
                    EQUITY CROSSOVER: <strong className="text-white font-bold">Year {crossoverYear}</strong>
                  </div>
                )}
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-sm flex items-center justify-between text-xs font-sans shadow-2xs" id="amort-results-summary">
                <span className="text-zinc-500 font-medium">Cumulative Interest Paid:</span>
                <span className="font-extrabold text-zinc-950 font-mono">
                  ${Math.round(amortizationPoints[amortizationPoints.length - 1]?.interest || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PRODUCT SHOWCASE 3: PROGRESSIVE TAX BRACKETS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" id="showcase-tax">
          {/* Left Side: Live Sandbox Widget */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center" id="showcase-tax-widget">
            <div className="w-full max-w-[440px] bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs relative overflow-hidden" id="tax-sandbox-card">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-900">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800 font-sans">Progressive Tax Bracket Stack</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 rounded-sm uppercase">Live Matrix</span>
              </div>

              {/* Slider for income */}
              <div className="space-y-2 mb-5" id="tax-slider-group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">ANNUAL INCOME (FILING)</span>
                  <span className="text-zinc-950 font-mono text-xs font-bold">${taxIncome.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="250000"
                  step="5000"
                  value={taxIncome}
                  onChange={(e) => setTaxIncome(parseInt(e.target.value))}
                  className="w-full accent-zinc-950 h-1 bg-zinc-100 rounded-sm appearance-none cursor-pointer"
                />
              </div>

              {/* Stacked Vertical Bracket Fill */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm space-y-4 shadow-2xs" id="tax-visualizer-container">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-700 font-sans">Tax Tier Accumulation</span>
                  <span className="font-mono text-xs text-zinc-500">Effective rate: <strong className="text-zinc-950 font-extrabold">{taxProgressiveData.effectiveRate.toFixed(1)}%</strong></span>
                </div>

                <div className="grid grid-cols-5 gap-2 h-20 items-end" id="progressive-towers">
                  {taxProgressiveData.breakdowns.map((bracket, i) => (
                    <div key={i} className="flex flex-col items-center h-full justify-end group relative">
                      {/* Interactive Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 bg-zinc-950 text-white text-[10px] font-mono p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Paid: ${Math.round(bracket.tax).toLocaleString()}
                      </div>

                      {/* Bar Container */}
                      <div className="w-full bg-zinc-200 h-14 rounded-sm overflow-hidden relative border border-zinc-300/20">
                        {/* Fill percentage */}
                        <div
                          style={{ height: `${bracket.fillRatio * 100}%` }}
                          className="w-full bg-zinc-900 absolute bottom-0 left-0 transition-all duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-700 font-mono mt-1">{bracket.label}</span>
                      <span className="text-[9px] text-zinc-400 font-sans tracking-tight">{bracket.caption}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-200 pt-3 flex justify-between items-center text-xs" id="tax-total-summary">
                  <span className="font-semibold text-zinc-500">Estimated Progressive Tax:</span>
                  <span className="font-extrabold text-zinc-950 font-mono text-sm">${Math.round(taxProgressiveData.totalTax).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4" id="tax-sandbox-actions">
                <button
                  onClick={() => onNavigateToCalculator('tax')}
                  className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-semibold rounded-sm font-sans transition-all cursor-pointer"
                >
                  Open Tax Calculator
                </button>
                <button
                  onClick={() => onNavigateToGuide('progressive-tax')}
                  className="py-2 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-700 text-xs font-semibold rounded-sm font-sans transition-all cursor-pointer"
                >
                  Tax Bracket Guide
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left" id="showcase-tax-copy">
            <div className="w-8 h-8 bg-zinc-50 border border-zinc-200/50 rounded-sm flex items-center justify-center text-zinc-900">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading leading-tight tracking-tight">
              Jump into a new dimension of tax planning.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
              Filing status, standard deductions, and progressive marginal rates create multi-variable complexity. Our tax engine maps out tax brackets as visual columns that populate sequentially based on your annual earnings, letting you immediately capture how effective and marginal rates behave.
            </p>
            <div className="flex items-center space-x-4 pt-1" id="showcase-tax-bullets">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Single & Joint</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Standard deductions</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-700 font-sans font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Progressive brackets</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. WORKFLOW TARGET SECTION */}
        <section className="bg-white border border-zinc-200 rounded-sm p-6 sm:p-8 md:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" id="workflow-integration">
          
          {/* Left: Beautiful mock layout visualization of corporate SaaS dashboard */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1" id="workflow-mock-dashboard">
            <div className="w-full max-w-[340px] bg-zinc-50 border border-zinc-200 rounded-sm p-4 shadow-2xs text-left font-sans select-none" id="mock-dashboard-wrapper">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                  <div className="w-2 h-2 bg-zinc-300 rounded-full" />
                  <div className="w-2 h-2 bg-zinc-200 rounded-full" />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">METRICORES OPERATIONAL CORE</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white border border-zinc-200 rounded-sm shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold">
                    <span>Corporate Yield Target</span>
                    <span className="text-zinc-900 font-mono font-semibold">Completed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-800">Return on Investment</span>
                    <span className="text-xs font-mono font-extrabold text-zinc-950">24.5% Annualized</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-sm shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold">
                    <span>Mortgage Refinancing</span>
                    <span className="text-zinc-500 font-mono font-semibold">Simulated</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-800">15-Year Fixed Curve</span>
                    <span className="text-xs font-mono font-extrabold text-zinc-950">4.12% Fixed</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-sm shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold">
                    <span>Enterprise Retail Cost</span>
                    <span className="text-zinc-500 font-mono font-semibold">Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-800">Gross Profit Yield</span>
                    <span className="text-xs font-mono font-extrabold text-zinc-950">$45,000 Cap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Target Persona Checklist */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left" id="workflow-checklist-content">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-sans block">
                Professional Integration
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading tracking-tight">
                Is Metricores in your daily planning?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
                Whether you're presenting to equity partners or organizing personal tax filing timelines, our mathematical engines provide verified compliance you can rely on.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="workflow-checks">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 font-sans">Real Estate Brokers</h4>
                  <p className="text-xs text-zinc-500 leading-snug">Estimating mortgage payments and loan amortizations for active buyers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 font-sans">Corporate Officers</h4>
                  <p className="text-xs text-zinc-500 leading-snug">Structuring investment portfolios and return multipliers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 font-sans">Retail Managers</h4>
                  <p className="text-xs text-zinc-500 leading-snug">Optimizing cost markups, product cost sheets, and margin ratios.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 font-sans">Tax Planners</h4>
                  <p className="text-xs text-zinc-500 leading-snug">Assessing federal income liabilities across progressive brackets.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 7. PARTNER TRUST GRID */}
        <section className="space-y-8" id="partner-logos-section">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-sans block">
              Global Standards Aligned
            </span>
            <h3 className="text-base font-bold text-zinc-900 font-heading">
              Partner with Metricores Studio
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Our mathematical formulations correspond directly with industry-wide banking rules and calculations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center max-w-4xl mx-auto opacity-40 grayscale hover:opacity-75 transition-opacity" id="partner-logos-grid">
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">VANGUARD</div>
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">FIDELITY</div>
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">STRIPE</div>
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">PLAID</div>
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">BREX</div>
            <div className="text-center font-black font-heading text-sm text-zinc-800 tracking-tight">CARTA</div>
          </div>
        </section>

        {/* 8. CASE STUDIES / STRATEGIC BUSINESS TEMPLATES */}
        <section className="space-y-8" id="strategic-templates-section">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-sans block">
              Scenario Blueprint Templates
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading tracking-tight">
              2026 Financial Strategy Blueprints
            </h2>
            <p className="text-xs text-zinc-500 font-sans">
              Select any pre-configured commercial case study or strategy template below to pre-populate our calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="blueprints-grid">
            {/* Card 1 */}
            <div
              onClick={() => onNavigateToCalculator('mortgage')}
              className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-950 hover:shadow-2xs transition-all duration-150 cursor-pointer flex flex-col justify-between h-56 select-none group"
              id="blueprint-card-1"
            >
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-850 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-max font-sans">Mortgages</span>
                <h4 className="text-xs font-bold text-zinc-900 font-heading leading-snug group-hover:underline transition-colors">
                  15-Year vs 30-Year Fixed Mortgage Refinance Strategy
                </h4>
                <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                  Evaluate interest expense reduction using accelerated amortization schedules over traditional 30-year spans.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-950 flex items-center mt-3 group-hover:underline">
                Open Calculator
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onNavigateToCalculator('profit-margin')}
              className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-950 hover:shadow-2xs transition-all duration-150 cursor-pointer flex flex-col justify-between h-56 select-none group"
              id="blueprint-card-2"
            >
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-850 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-max font-sans">Margins</span>
                <h4 className="text-xs font-bold text-zinc-900 font-heading leading-snug group-hover:underline transition-colors">
                  E-commerce Gross Profit Margin & Markups COGS Sheet
                </h4>
                <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                  Standard variables designed to calculate markups and revenue yields to absorb shipment overhead.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-950 flex items-center mt-3 group-hover:underline">
                Open Calculator
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onNavigateToCalculator('roi')}
              className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-950 hover:shadow-2xs transition-all duration-150 cursor-pointer flex flex-col justify-between h-56 select-none group"
              id="blueprint-card-3"
            >
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-850 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-max font-sans">Portfolio</span>
                <h4 className="text-xs font-bold text-zinc-900 font-heading leading-snug group-hover:underline transition-colors">
                  Venture Equity Annualized Return on Capital Template
                </h4>
                <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                  Generate annualized growth rates, investment multiples, and relative ratios over typical 7-year investment cycles.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-950 flex items-center mt-3 group-hover:underline">
                Open Calculator
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => onNavigateToCalculator('interest')}
              className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-950 hover:shadow-2xs transition-all duration-150 cursor-pointer flex flex-col justify-between h-56 select-none group"
              id="blueprint-card-4"
            >
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-850 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-max font-sans">Savings</span>
                <h4 className="text-xs font-bold text-zinc-900 font-heading leading-snug group-hover:underline transition-colors">
                  F.I.R.E. Compound Interest Milestone Planning
                </h4>
                <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                  Calculate compounding interest timelines on monthly contributions to target retirement dates.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-950 flex items-center mt-3 group-hover:underline">
                Open Calculator
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </section>

        {/* 9. LATEST FINANCIAL GUIDES */}
        <section className="space-y-8" id="home-guides-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 pb-5" id="home-guides-header">
            <div className="space-y-1 text-center sm:text-left" id="guides-head-text">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-sans block">
                Expert Methodologies
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-heading tracking-tight">
                Latest Strategy Guides
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab('guides')}
              className="mt-3 sm:mt-0 text-xs font-extrabold text-zinc-950 hover:underline flex items-center justify-center cursor-pointer focus:outline-none font-sans"
              id="home-view-all-guides"
            >
              Explore All Guides
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="home-guides-grid">
            {guidesData.slice(0, 3).map((article) => (
              <article
                key={article.id}
                className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-950 hover:shadow-2xs transition-all duration-150 flex flex-col justify-between h-56 cursor-pointer group"
                onClick={() => onNavigateToGuide(article.id)}
                id={`article-card-${article.id}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 uppercase font-sans font-bold">
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-sm font-semibold">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 font-heading line-clamp-2 leading-snug group-hover:underline transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <span className="text-xs font-bold text-zinc-950 group-hover:underline mt-4 block font-sans">
                  Read Article →
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* 10. POLISHED CTA CONTAINER */}
        <section
          className="bg-zinc-950 text-white border border-zinc-800 rounded-sm p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-2xs relative overflow-hidden"
          id="cta-section"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

          <h2 className="text-2xl font-extrabold font-heading tracking-tight text-white">
            Ready to calculate with absolute accuracy?
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-lg mx-auto leading-relaxed">
            Run custom amortizations, capture margin ratios, and simulate tax liabilities concurrently in a unified, verified workspace. Free of charge and built with absolute compliance.
          </p>

        </section>

      </div>
    </div>
  );
}
