import { useState, useEffect } from 'react';
import { Search, Zap, ArrowRight } from 'lucide-react';
import { calculatorsData } from '@/data/calculators';
import { calcIcons } from './CalculatorView';

interface CalculatorsDirectoryProps {
  onSelectCalculator: (id: string) => void;
}

export default function CalculatorsDirectory({ onSelectCalculator }: CalculatorsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const calcs = Object.values(calculatorsData);

  // Extract all unique categories
  const categories = ['All', 'Basic Mathematics', 'Financial Mathematics', 'Practical Mathematics'];

  // Sync category & search from URL hash if provided
  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const queryPart = hash.split('?')[1];
        const params = new URLSearchParams(queryPart);
        
        const cat = params.get('category');
        if (cat && categories.includes(cat)) {
          setSelectedCategory(cat);
        } else {
          setSelectedCategory('All');
        }

        const search = params.get('search');
        if (search) {
          setSearchQuery(decodeURIComponent(search));
        } else {
          setSearchQuery('');
        }
      } else {
        setSelectedCategory('All');
        setSearchQuery('');
      }
    };

    parseHashParams();

    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, []);

  // Filter based on search and category
  const filteredCalcs = calcs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Alphabetical sorting
  const sortedCalcs = [...filteredCalcs].sort((a, b) => {
    if (sortBy === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="py-10 md:py-16 max-w-[95%] w-[95%] mx-auto px-4 md:px-6 space-y-10" id="directory-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-2.5 max-w-2xl" id="directory-header">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 font-sans block">
          Calculators Directory
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 font-heading">
          All Mathematical Tools
        </h1>
        <p className="text-sm text-zinc-500 font-sans leading-relaxed">
          Select any verified mathematical utility below to compute algebraic problems, practical ratios, financial formulas, or geometry/tax estimations.
        </p>
      </div>

      {/* Filter Row: Search, Sorting & Categories */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-zinc-200/50 pb-6" id="directory-filters">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:max-w-xl">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs flex items-center" id="search-input-group">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-white border border-zinc-200 text-xs rounded-sm text-zinc-900 shadow-2xs focus:outline-none focus:ring-1 focus:ring-zinc-950/20 focus:border-zinc-950 font-sans transition-all"
              id="directory-search-field"
            />
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2 w-full sm:w-auto" id="sorting-group">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans tracking-wider shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
              className="py-1.5 px-3 bg-white border border-zinc-200 text-xs rounded-sm text-zinc-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-zinc-950/20 font-sans w-full sm:w-auto"
              id="directory-sort-select"
            >
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Pill List */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0" id="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap cursor-pointer transition-all focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
              id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of matches */}
      {sortedCalcs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="directory-grid">
          {sortedCalcs.map((calc) => {
            const Icon = calcIcons[calc.id] || Zap;
            return (
              <div
                key={calc.id}
                className="bg-white border border-zinc-200 rounded-sm p-5 hover:shadow-2xs transition-all duration-200 flex flex-col justify-between h-56"
                id={`directory-card-${calc.id}`}
              >
                <div className="space-y-3" id={`dir-card-head-${calc.id}`}>
                  <div className="flex items-center justify-between" id={`dir-card-meta-${calc.id}`}>
                    <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-wider font-sans">
                      {calc.category}
                    </span>
                  </div>
                  <div className="flex items-start space-x-3" id={`dir-card-title-row-${calc.id}`}>
                    <div className="w-8 h-8 bg-zinc-50 rounded-sm border border-zinc-200/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-zinc-900" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold text-zinc-900 font-heading">
                        {calc.name}
                      </h2>
                      <p className="text-xs text-zinc-500 font-sans line-clamp-3 leading-relaxed">
                        {calc.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCalculator(calc.id)}
                  className="mt-4 text-xs font-semibold text-zinc-900 hover:text-zinc-950 flex items-center focus:outline-none cursor-pointer"
                  id={`directory-card-btn-${calc.id}`}
                >
                  Open Calculator
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-sm text-zinc-400 font-sans" id="directory-no-results">
          No calculators matched your current search and category criteria.
        </div>
      )}
    </div>
  );
}
