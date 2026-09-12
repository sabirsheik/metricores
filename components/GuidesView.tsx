import { BookOpen, Clock, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { GuideArticle } from '@/types';
import { guidesData } from '@/data/guides';

interface GuidesViewProps {
  activeGuideId: string | null;
  onSelectGuide: (id: string | null) => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function GuidesView({
  activeGuideId,
  onSelectGuide,
  onNavigateToCalculator
}: GuidesViewProps) {
  const selectedArticle = guidesData.find((g) => g.id === activeGuideId);

  // Quick link helper to relate articles to physical calculators
  const getRelatedCalculatorId = (articleId: string): string | null => {
    if (articleId === 'understanding-amortization') return 'mortgage';
    if (articleId === 'marginal-vs-effective-tax-rates') return 'tax';
    if (articleId === 'gross-margin-vs-markup') return 'profit-margin';
    return null;
  };

  if (selectedArticle) {
    const calcId = getRelatedCalculatorId(selectedArticle.id);
    return (
      <div className="py-12 md:py-20 w-[95%] mx-auto px-4 space-y-10" id="guide-detail-container">
        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-y-1.5 space-x-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 print:hidden" id="guide-breadcrumbs">
          <button 
            onClick={() => {
              onSelectGuide(null);
            }} 
            className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
          >
            Home
          </button>
          <span className="text-zinc-300 font-sans">&gt;</span>
          <button 
            onClick={() => onSelectGuide(null)} 
            className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
          >
            Guides
          </button>
          <span className="text-zinc-300 font-sans">&gt;</span>
          <span className="text-zinc-950 font-bold truncate max-w-[180px] sm:max-w-none">{selectedArticle.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => onSelectGuide(null)}
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 group font-mono focus:outline-none cursor-pointer"
          id="btn-back-to-guides"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Guides
        </button>

        {/* Article Meta Header */}
        <div className="space-y-4 border-b border-zinc-150 pb-8" id="article-head">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            <span className="inline-flex items-center bg-zinc-900 border border-zinc-800 text-white px-2.5 py-0.5 rounded-xs font-semibold">
              {selectedArticle.category}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center font-semibold text-zinc-500">
              <Clock className="w-3.5 h-3.5 mr-1" /> 
              {selectedArticle.readTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading leading-tight max-w-4xl">
            {selectedArticle.title}
          </h1>
          <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono uppercase tracking-wider" id="article-author">
            <span>By Metricores Team</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="text-zinc-600 font-sans text-[14.5px] md:text-[15.5px] leading-relaxed space-y-6 max-w-none" id="article-body">
          {selectedArticle.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('###')) {
              return (
                <h2 key={index} className="text-xl md:text-2xl font-black text-zinc-950 font-heading pt-6 pb-2 border-b border-zinc-100">
                  {paragraph.replace('###', '').trim()}
                </h2>
              );
            }
            if (paragraph.startsWith('-')) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-3 py-1">
                  {paragraph.split('\n').map((li, liIdx) => (
                    <li key={liIdx} className="pl-1 text-zinc-600">
                      {li.replace('-', '').trim()}
                    </li>
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.')) {
              return (
                <ol key={index} className="list-decimal pl-5 space-y-3 py-1">
                  {paragraph.split('\n').map((li, liIdx) => (
                    <li key={liIdx} className="pl-1 text-zinc-600">
                      {li.replace(/^\d+\.\s*/, '').trim()}
                    </li>
                  ))}
                </ol>
              );
            }
            return <p key={index} className="text-zinc-600">{paragraph}</p>;
          })}
        </div>

        {/* Quick Calculator CTA inside Guide */}
        {calcId && (
          <div className="mt-14 bg-zinc-50 p-6 md:p-8 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" id="guide-calculator-promo">
            <div className="space-y-1.5" id="promo-text">
              <h3 className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest font-mono">
                Interactive Calculation Tool Available
              </h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed max-w-xl">
                Put this guide's concepts into direct practice utilizing our verified responsive mathematical matrices.
              </p>
            </div>
            <button
              onClick={() => onNavigateToCalculator(calcId)}
              className="py-3 px-5 bg-zinc-950 hover:bg-zinc-900 text-white font-mono text-[11px] font-extrabold uppercase tracking-widest rounded-xs transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none flex items-center justify-center shrink-0 border border-transparent"
              id="promo-btn"
            >
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 max-w-[95%] w-[95%] mx-auto px-4 space-y-12" id="guides-list-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-3 max-w-3xl" id="guides-list-header">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono block">
          Strategic Insights
        </span>
        <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950 font-heading">
          Financial & Business Guides
        </h1>
        <p className="text-sm md:text-[14.5px] text-zinc-500 font-sans leading-relaxed max-w-2xl">
          In-depth methodologies and expert insights regarding corporate tax, progressive bracket systems, real estate amortization, and markup definitions.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="guides-list-grid">
        {guidesData.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectGuide(article.id)}
            className="group bg-white border border-zinc-200 p-6 rounded-xl hover:border-zinc-350 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[250px] cursor-pointer relative"
            id={`guides-list-card-${article.id}`}
          >
            <div className="space-y-3" id={`guides-list-content-${article.id}`}>
              <div className="flex items-center space-x-2 text-[9px] text-zinc-400 uppercase font-mono font-extrabold tracking-widest">
                <span className="text-zinc-500">{article.category}</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-400">{article.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-zinc-950 font-sans group-hover:text-black leading-snug tracking-tight">
                {article.title}
              </h2>
              <p className="text-[12px] text-zinc-500 font-sans line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 font-mono inline-flex items-center transition-all">
                Read Guide
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

