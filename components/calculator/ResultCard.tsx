import React, { useState } from 'react';
import { Copy, Check, Printer, RotateCcw, AlertTriangle, Calendar, Info } from 'lucide-react';
import { ResultField, InputField } from '../../types';
import { formatCurrency, formatPercentage, formatNumber, formatDate } from '../../utils/format';
import { useToast } from './Toast';

interface ResultCardProps {
  results: ResultField[];
  inputs: Record<string, any>;
  inputConfigs: InputField[];
  calculatorName: string;
  onReset: () => void;
  isLoading?: boolean;
}

export default function ResultCard({
  results,
  inputs,
  inputConfigs,
  calculatorName,
  onReset,
  isLoading = false
}: ResultCardProps) {
  const [copying, setCopying] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { addToast } = useToast();

  const primaryResult = results.find((r) => r.isPrimary);
  const secondaryResults = results.filter((r) => !r.isPrimary);

  // Formatting helper
  const formatResult = (res: ResultField) => {
    const val = res.value;
    if (typeof val === 'string') return val;
    if (val === Infinity || val === -Infinity) return 'Infinite';
    if (isNaN(val)) return 'Invalid Input';

    // We can check if a custom prefix/suffix is defined on the result
    const pre = res.prefix || '';
    const suf = res.suffix || '';

    if (res.format === 'currency') {
      // Check if GBP or EUR can be selected or fallback to standard USD
      return formatCurrency(val, 'USD');
    }
    if (res.format === 'percent') {
      return formatPercentage(val);
    }
    if (res.format === 'number') {
      return pre + formatNumber(val) + suf;
    }
    return String(val);
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    setCopying(true);

    const inputsText = inputConfigs
      .map((i) => {
        const val = inputs[i.id];
        return `  - ${i.label}: ${i.prefix || ''}${val !== undefined ? val : ''}${i.suffix || ''}`;
      })
      .join('\n');

    const resultsText = results
      .map((r) => `  - ${r.label}: ${formatResult(r)}`)
      .join('\n');

    const formattedCopyText = `Metricores Financial Verification System
==================================================
CALCULATOR : ${calculatorName}
--------------------------------------------------
INPUT PARAMETERS:
${inputsText}
--------------------------------------------------
COMPUTED RESULTS:
${resultsText}
==================================================
Verified mathematically. All calculations are compliant with standard corporate algorithms.`;

    navigator.clipboard.writeText(formattedCopyText);
    addToast('Results report copied to clipboard!', 'success');
    setTimeout(() => setCopying(false), 1500);
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 500);
  };

  const todayStr = formatDate(new Date());

  return (
    <div
      className="bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs flex flex-col justify-between h-full space-y-6"
      id="results-card-container"
    >
      {results.length > 0 ? (
        <div className="flex flex-col h-full justify-between space-y-6" id="results-active-state">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3" id="results-header">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
              Calculation Results
            </h2>
            <div className="flex space-x-1.5 print:hidden" id="results-tools">
              <button
                onClick={handleCopy}
                disabled={copying}
                className="p-2 hover:bg-zinc-50 border border-zinc-200 rounded-sm text-zinc-500 hover:text-zinc-800 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
                title="Copy verification report"
                id="copy-results-btn"
              >
                {copying ? (
                  <Check className="w-4 h-4 text-zinc-900" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handlePrint}
                disabled={printing}
                className="p-2 hover:bg-zinc-50 border border-zinc-200 rounded-sm text-zinc-500 hover:text-zinc-800 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
                title="Print report"
                id="print-results-btn"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
 
          {/* Primary Result Box */}
          {primaryResult && (
            <div
              className="bg-zinc-50/50 p-5 rounded-sm border border-zinc-200/60 flex flex-col space-y-1 relative overflow-hidden"
              id="primary-result-box"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
                {primaryResult.label}
              </span>
              <span className="text-3xl md:text-4.5xl font-extrabold text-zinc-950 font-mono tracking-tight leading-none break-all py-1">
                {formatResult(primaryResult)}
              </span>
            </div>
          )}
 
          {/* Secondary Results Breakdown */}
          {secondaryResults.length > 0 && (
            <div className="space-y-3" id="secondary-results-list">
              {secondaryResults.map((res) => (
                <div
                   key={res.id}
                   className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0"
                   id={`secondary-row-${res.id}`}
                >
                  <span className="text-xs font-semibold text-zinc-500 font-sans">
                    {res.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-800 font-mono">
                    {formatResult(res)}
                  </span>
                </div>
              ))}
            </div>
          )}
 
          {/* Input & Parameters Summary Section */}
          <div
            className="bg-zinc-50/30 rounded-sm p-3.5 border border-zinc-200/50 space-y-2 text-left"
            id="results-input-summary"
          >
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Parameter Summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-0.5" id="summary-parameters-grid">
              {inputConfigs.map((i) => {
                const val = inputs[i.id];
                return (
                  <div key={i.id} className="flex flex-col space-y-0.5">
                    <span className="text-xs text-zinc-400 font-sans">
                      {i.label}
                    </span>
                    <span className="text-xs font-semibold text-zinc-700 font-mono">
                      {i.prefix || ''}
                      {val !== undefined && val !== '' ? val : '0'}
                      {i.suffix || ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Legal Disclaimer */}
          <div
            className="pt-4 border-t border-zinc-100 text-[10px] text-zinc-400 font-sans leading-relaxed"
            id="results-disclaimer"
          >
            Estimates provided for planning. Compliant with standard financial formulas. All figures processed inside client browser.
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center py-16 h-full space-y-3"
          id="results-empty-state"
        >
          <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/60 rounded-sm flex items-center justify-center mb-1">
            <AlertTriangle className="w-6 h-6 text-zinc-300 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-zinc-400 font-sans max-w-[200px] leading-relaxed">
            Please input configuration parameters and calculate to output metrics.
          </p>
        </div>
      )}
 
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-sm backdrop-blur-[1px]">
          <span className="text-xs font-semibold text-zinc-950 font-sans animate-pulse">
            Re-calculating Engine Parameters...
          </span>
        </div>
      )}
    </div>
  );
}
