import { useState, useEffect } from 'react';
import { Search, Zap, ArrowUpRight, Calculator, Landmark, BriefcaseBusiness, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { calculatorsData } from '@/data/calculators';
import { calcIcons } from './calculator/calcIcons';

interface CalculatorsDirectoryProps {
  onSelectCalculator: (id: string) => void;
}

export default function CalculatorsDirectory({ onSelectCalculator }: CalculatorsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const calcs = Object.values(calculatorsData);

  // Extract all unique categories
  const categories = ['All', 'Basic Mathematics', 'Financial Mathematics', 'Personal Finance', 'Practical Mathematics', 'Planning / Everyday'];
  const categoryLabels: Record<string, string> = {
    All: 'ALL',
    'Basic Mathematics': 'BASIC',
    'Financial Mathematics': 'FINANCIAL',
    'Personal Finance': 'PERSONAL FINANCE',
    'Practical Mathematics': 'PRACTICAL',
    'Planning / Everyday': 'PLANNING'
  };

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
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords?.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const categoryGroups = [
    {
      name: 'Basic Mathematics',
      label: 'BASIC',
      description: 'Fast tools for everyday mathematical thinking.',
      icon: Calculator,
      accent: 'directory-section-basic'
    },
    {
      name: 'Financial Mathematics',
      label: 'FINANCE',
      description: 'Make clearer decisions with numbers that matter.',
      icon: Landmark,
      accent: 'directory-section-finance'
    },
    {
      name: 'Personal Finance',
      label: 'PERSONAL FINANCE',
      description: 'Plan home equity and household financial decisions.',
      icon: Landmark,
      accent: 'directory-section-finance'
    },
    {
      name: 'Practical Mathematics',
      label: 'PRACTICAL',
      description: 'Useful answers for real-world calculations.',
      icon: BriefcaseBusiness,
      accent: 'directory-section-practical'
    },
    {
      name: 'Planning / Everyday',
      label: 'PLANNING',
      description: 'Everyday tools for dates, timelines, and planning.',
      icon: Calendar,
      accent: 'directory-section-practical'
    }
  ];

  return (
    <div className="directory-shell py-10 md:py-16 max-w-[95%] w-[95%] mx-auto px-4 md:px-6 space-y-10" id="directory-container">
      {/* Header */}
      <div className="directory-heading text-center space-y-3 max-w-3xl mx-auto" id="directory-header">
        <span className="directory-kicker text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600 font-sans block">
          Computational dashboard
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] text-zinc-950 font-heading">
          Explore computational suites
        </h1>
        <p className="text-sm md:text-base text-zinc-500 font-sans leading-relaxed max-w-2xl mx-auto">
          Access clean, high-fidelity mathematical tools immediately by choosing a suite below.
        </p>
      </div>

      {/* Filter Row: Search, Sorting & Categories */}
      <div className="directory-filters flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-zinc-200/60 pb-6" id="directory-filters">
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
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped calculator suites */}
      {sortedCalcs.length > 0 ? (
        <div className="space-y-14" id="directory-grid">
          {categoryGroups.map((group, groupIndex) => {
            const groupCalcs = sortedCalcs.filter((calc) => calc.category === group.name);
            if (groupCalcs.length === 0) return null;
            const GroupIcon = group.icon;

            return (
              <motion.section
                key={group.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: groupIndex * 0.08 }}
                className={`directory-section ${group.accent}`}
                id={`directory-section-${group.label.toLowerCase()}`}
              >
                <div className="directory-section-heading flex items-end justify-between gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="directory-section-icon flex items-center justify-center shrink-0">
                      <GroupIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-950 font-heading">{group.name}</h2>
                        <span className="directory-count">{String(groupCalcs.length).padStart(2, '0')}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 font-sans">{group.description}</p>
                    </div>
                  </div>
                  <span className="hidden sm:block directory-section-label">{group.label} / SUITE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {groupCalcs.map((calc, cardIndex) => {
                    const Icon = calcIcons[calc.id] || Zap;
                    return (
                      <motion.button
                        key={calc.id}
                        type="button"
                        onClick={() => onSelectCalculator(calc.id)}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: groupIndex * 0.08 + cardIndex * 0.045 }}
                        className="directory-card text-left"
                        id={`directory-card-${calc.id}`}
                      >
                        <span className="directory-card-icon"><Icon className="w-5 h-5" /></span>
                        <span className="directory-card-content">
                          <span className="directory-card-name">{calc.name}</span>
                          <span className="directory-card-category">{group.label}</span>
                        </span>
                        <ArrowUpRight className="directory-card-arrow w-4 h-4" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
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
