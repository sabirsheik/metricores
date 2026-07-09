import React, { useState } from 'react';
import { ShieldAlert, Home, Search } from 'lucide-react';

interface NotFoundViewProps {
  onGoHome: () => void;
  onSearch?: (query: string) => void;
}

export default function NotFoundView({ onGoHome, onSearch }: NotFoundViewProps) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="py-20 md:py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4" id="notfound-container">
      <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-6" id="notfound-icon-wrapper">
        <ShieldAlert className="w-7 h-7 text-red-600" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-sans block mb-1">
        Error Code 404
      </span>
      <h1 className="text-2xl font-extrabold text-zinc-900 font-heading tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-xs text-zinc-500 font-sans leading-relaxed mb-6">
        The URL path you attempted to reach does not exist or has been relocated within our directory mapping. Use the search bar below or return to the homepage.
      </p>

      {/* Interactive Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full mb-6 flex items-center" id="notfound-search-form">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search mortgage, taxes, margins, ROI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2.5 pl-10 pr-4 bg-white border border-zinc-200 text-xs rounded-xl text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-sans transition-all"
          id="notfound-search-input"
        />
      </form>

      <button
        onClick={onGoHome}
        className="inline-flex items-center py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow cursor-pointer focus:outline-none"
        id="btn-notfound-gohome"
      >
        <Home className="w-3.5 h-3.5 mr-2" />
        Return to Homepage
      </button>
    </div>
  );
}
