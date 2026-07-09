import { HelpCircle } from 'lucide-react';
import FAQAccordion from './FAQAccordion';
import { FAQItem } from '@/types';

export default function FAQView() {
  const faqItems: FAQItem[] = [
    {
      question: "How does Metricores guarantee the mathematical accuracy of its calculators?",
      answer: "All calculation algorithms are structured and verified against standard algebraic and financial frameworks, including Federal Reserve Regulation Z standards for APR rules and conventional mortgage amortization formulas. We regularly test our calculation engines against certified spreadsheets and accounting packages to ensure elite precision down to decimal boundaries."
    },
    {
      question: "Are the financial results generated legally binding or certified?",
      answer: "No. All outputs, estimates, amortization schedules, and rates are compiled strictly for planning, academic, and informational purposes. They do not constitute official investment, legal, tax, or mortgage advice. We strongly recommend consulting a certified public accountant (CPA), licensed financial adviser, or mortgage broker before executing real-world transactions."
    },
    {
      question: "Why does the platform not require a user registration account?",
      answer: "We are committed to absolute friction-free utility. Most online calculators require registrations specifically to harvest email leads, track search trends, or construct marketing profiles. Metricores respects your time and productivity; therefore, 100% of our premium calculation directory is open access and fully functional without accounts, payloads, or emails."
    },
    {
      question: "Where are my input parameters and values stored?",
      answer: "Your input parameters are processed entirely within your device's browser memory (Client-Side State Engine). No values are transmitted, compiled, or logged on our servers. Closing your browser tab securely deletes all operational values, preventing any trace retrieval or persistent tracking."
    },
    {
      question: "Can corporate organizations integrate or link to Metricores calculators?",
      answer: "Yes. Metricores is designed as an elite, high-performance web asset. Corporate departments, real estate agencies, and financial advisers can bookmark specific calculator tools, share self-contained links with clients, or link to our directories for daily operational planning with zero subscription fees."
    }
  ];

  return (
    <div className="py-12 md:py-20 w-[95%] mx-auto px-4 space-y-12" id="faq-view-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-3" id="faq-header">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono block">
          Support Center
        </span>
        <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-sm md:text-[14.5px] text-zinc-500 font-sans leading-relaxed">
          Clear, transparent answers about our calculators' professional utility, mathematical compliance, and user privacy.
        </p>
      </div>

      {/* Accordion List */}
      <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-xl shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)]" id="faq-accordion-box">
        <div className="flex items-center space-x-3 pb-6 border-b border-zinc-100 mb-6" id="faq-title-bar">
          <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-800">
            <HelpCircle className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-950 font-sans">
            General Inquiries
          </h2>
        </div>
        <FAQAccordion items={faqItems} />
      </div>

      {/* Dynamic Support Callout */}
      <div className="bg-zinc-50 p-6 md:p-8 rounded-xl border border-zinc-250/50 text-center space-y-3.5" id="faq-support-callout">
        <h3 className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">
          Still need assistance?
        </h3>
        <p className="text-xs text-zinc-500 font-sans leading-relaxed mx-auto">
          For technical issues, feedback on calculation metrics, or general operational suggestions, our product documentation can be accessed via the strategic guides.
        </p>
        <div>
          <button 
            onClick={() => window.location.hash = '#/guides'}
            className="inline-flex items-center justify-center py-2.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs transition-all duration-150 cursor-pointer focus:outline-none"
            id="faq-guides-redirect-btn"
          >
            Browse Strategic Guides
          </button>
        </div>
      </div>
    </div>
  );
}
