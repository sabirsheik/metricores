import { useEffect, useRef, useState } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculatorsData } from '@/data/calculators';
import { calcIcons } from './CalculatorView';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectCalculator }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape, Navigate on Enter/Arrow keys
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filtered calculators
  const filtered = Object.values(calculatorsData).filter((calc) => {
    return (
      calc.name.toLowerCase().includes(query.toLowerCase()) ||
      calc.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      calc.category.toLowerCase().includes(query.toLowerCase()) ||
      calc.keywords?.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectCalculator(filtered[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="search-modal-root" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/45 backdrop-blur-xs transition-opacity"
            id="search-backdrop"
          />

          {/* Modal box */}
          <div className="flex min-h-screen items-start justify-center p-4 pt-16 sm:pt-28" id="search-container-box">
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white border border-zinc-200 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden"
              id="search-panel"
            >
              {/* Input field */}
              <div className="flex items-center px-4.5 py-4 border-b border-zinc-100" id="search-input-wrapper">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search mathematical calculators (e.g., percentages, mortgage, discounts)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent border-0 text-sm font-sans text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-0 py-0.5 pl-10 pr-3"
                    id="search-input-el"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="ml-3 p-1.5 hover:bg-zinc-100/80 rounded-sm text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
                  id="search-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Matches list */}
              <div className="max-h-80 overflow-y-auto p-2" id="search-results-list">
                {filtered.length > 0 ? (
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-3 py-2 block font-mono">
                      Calculator Matches
                    </span>
                    {filtered.map((calc, idx) => {
                      const ItemIcon = calcIcons[calc.id] || Search;
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={calc.id}
                          onClick={() => {
                            onSelectCalculator(calc.id);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left flex items-center justify-between px-3 py-3 rounded-sm transition-all cursor-pointer focus:outline-none ${
                            isSelected
                              ? 'bg-zinc-950 text-white'
                              : 'text-zinc-600 hover:bg-zinc-50/70'
                          }`}
                          id={`search-item-${calc.id}`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-1.5 rounded-sm shrink-0 flex items-center justify-center ${
                              isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500'
                            }`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <span className={`text-[12.5px] font-semibold block font-sans ${
                                isSelected ? 'text-white' : 'text-zinc-900'
                              }`}>
                                {calc.name}
                              </span>
                              <span className={`text-[11px] block leading-normal font-sans line-clamp-1 ${
                                isSelected ? 'text-zinc-400' : 'text-zinc-500'
                              }`}>
                                {calc.shortDescription}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[9px] font-bold text-zinc-300 flex items-center font-mono uppercase tracking-wider bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded-sm shrink-0">
                              <CornerDownLeft className="w-3 h-3 mr-1" />
                              enter
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-xs text-zinc-400 font-mono" id="search-no-results">
                    No matching calculators found for "{query}".
                  </div>
                )}
              </div>

              {/* Keyboard helper footer */}
              <div className="bg-zinc-50/50 px-4.5 py-3 border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center space-x-5 font-mono select-none" id="search-footer-shortcuts">
                <span className="flex items-center">
                  <span className="inline-flex items-center justify-center h-4.5 px-1.5 bg-white border border-zinc-200 rounded-sm text-[9px] font-bold text-zinc-500 mr-1.5 shadow-2xs">↑↓</span>
                  navigate
                </span>
                <span className="flex items-center">
                  <span className="inline-flex items-center justify-center h-4.5 px-1.5 bg-white border border-zinc-200 rounded-sm text-[9px] font-bold text-zinc-500 mr-1.5 shadow-2xs">Enter</span>
                  select
                </span>
                <span className="flex items-center">
                  <span className="inline-flex items-center justify-center h-4.5 px-1.5 bg-white border border-zinc-200 rounded-sm text-[9px] font-bold text-zinc-500 mr-1.5 shadow-2xs">Esc</span>
                  close
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
