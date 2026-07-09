import React from 'react';
import { RotateCcw, Trash2, ChevronRight } from 'lucide-react';

interface ActionButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  onClear: () => void;
  isCalculating?: boolean;
  isResetting?: boolean;
}

export default function ActionButtons({
  onCalculate,
  onReset,
  onClear,
  isCalculating = false,
  isResetting = false
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-12 gap-3 pt-2 print:hidden" id="calculator-actions-row">
      <button
        type="button"
        onClick={onCalculate}
        disabled={isCalculating}
        className="col-span-6 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-950/70 text-white font-sans text-xs font-medium rounded-sm transition-all duration-150 active:scale-[0.98] shadow-2xs focus:outline-none focus:ring-1 focus:ring-zinc-950/20 flex items-center justify-center gap-1 cursor-pointer"
        id="calc-submit-btn"
      >
        {isCalculating ? 'Calculating...' : 'Calculate'}
        {!isCalculating && <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isResetting}
        className="col-span-3 py-2.5 px-3 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 text-zinc-600 font-sans text-xs font-medium rounded-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-zinc-950/10 cursor-pointer"
        title="Reset to default fields"
        id="calc-reset-btn"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1" />
        <span className="hidden sm:inline">Reset</span>
      </button>

      <button
        type="button"
        onClick={onClear}
        className="col-span-3 py-2.5 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-sans text-xs font-medium rounded-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-zinc-950/10 cursor-pointer"
        title="Clear all fields"
        id="calc-clear-btn"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" />
        <span className="hidden sm:inline">Clear</span>
      </button>
    </div>
  );
}
