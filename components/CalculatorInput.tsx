import React, { useState } from 'react';
import { InputField } from '@/types';
import { HelpCircle } from 'lucide-react';

interface CalculatorInputProps {
  field: InputField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function CalculatorInput({ field, value, onChange, error }: CalculatorInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    if (field.type === 'number') {
      if (val === '') {
        onChange('');
      } else {
        onChange(Number(val));
      }
    } else {
      onChange(val);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full" id={`container-${field.id}`}>
      {/* Label and Tooltip */}
      <div className="flex items-center justify-between" id={`label-row-${field.id}`}>
        <label
          htmlFor={field.id}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-sans flex items-center"
          id={`label-${field.id}`}
        >
          {field.label}
          {field.tooltip && (
            <div className="relative ml-1.5 inline-block group" id={`tooltip-${field.id}`}>
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                tabIndex={-1}
                aria-label={`About ${field.label}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 text-white text-[11px] leading-normal font-sans rounded-md shadow-lg z-50 pointer-events-none transition-all">
                  {field.tooltip}
                </div>
              )}
            </div>
          )}
        </label>
      </div>

      {/* Input Elements */}
      <div className="relative w-full" id={`wrapper-${field.id}`}>
        {field.type === 'boolean' ? (
          <label className="inline-flex items-center cursor-pointer select-none py-1.5" id={`toggle-label-${field.id}`}>
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={handleCheckboxChange}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2.5 text-xs font-medium text-zinc-700 font-sans">
              Active
            </span>
          </label>
        ) : field.type === 'select' ? (
          <select
            id={field.id}
            value={value ?? ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 bg-white text-sm border ${
              error ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-200'
            } rounded-xl text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-sans appearance-none transition-all duration-200 cursor-pointer pr-10`}
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative flex items-center" id={`input-group-${field.id}`}>
            {/* Suffix/Prefix indicators */}
            {field.prefix && (
              <span className="absolute left-3.5 text-zinc-400 text-sm font-sans pointer-events-none select-none">
                {field.prefix}
              </span>
            )}
            <input
              type={field.type === 'date' ? 'date' : 'number'}
              id={field.id}
              value={value ?? ''}
              min={field.min}
              max={field.max}
              step={field.step}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              className={`w-full py-2 bg-white text-sm border ${
                error ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-200'
              } rounded-xl text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-sans transition-all duration-200 ${
                field.prefix ? 'pl-8' : 'pl-3.5'
              } ${field.suffix ? 'pr-12' : 'pr-3.5'}`}
            />
            {field.suffix && (
              <span className="absolute right-3.5 text-zinc-400 text-xs font-semibold font-mono pointer-events-none select-none">
                {field.suffix}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[11px] font-sans text-red-600 mt-0.5" id={`error-${field.id}`}>
          {error}
        </p>
      )}
    </div>
  );
}
