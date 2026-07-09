import React from 'react';
import { InputField as InputFieldType } from '../../types';
import { HelpCircle } from 'lucide-react';

interface InputFieldProps {
  field: InputFieldType;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}

export default function InputField({ field, value, onChange, error }: InputFieldProps) {
  const { id, label, type, min, max, step, prefix, suffix, placeholder, options, tooltip } = field;

  // Handle number changing safely
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange('');
      return;
    }
    const parsed = Number(rawVal);
    onChange(isNaN(parsed) ? '' : parsed);
  };

  const hasRangeSlider = type === 'number' && min !== undefined && max !== undefined;

  return (
    <div className="space-y-1.5" id={`input-container-${id}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5"
          id={`label-${id}`}
        >
          {label}
          {tooltip && (
            <div className="relative group cursor-help" id={`tooltip-trigger-${id}`}>
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-lg z-50 font-sans font-normal leading-normal">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        {error && (
          <span className="text-[10px] font-semibold text-red-600 font-sans" id={`error-${id}`}>
            {error}
          </span>
        )}
      </div>

      {type === 'number' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            {prefix && (
              <span className="absolute left-3.5 text-xs text-zinc-400 font-sans font-medium pointer-events-none">
                {prefix}
              </span>
            )}
            <input
              type="number"
              id={id}
              name={id}
              value={value !== undefined ? value : ''}
              onChange={handleNumberChange}
              placeholder={placeholder || '0'}
              min={min}
              max={max}
              step={step || 'any'}
              aria-invalid={!!error}
              aria-describedby={error ? `error-${id}` : undefined}
              className={`w-full py-2 pl-${prefix ? '8' : '3'} pr-${suffix ? '8' : '3'} bg-white border ${
                error
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-zinc-200 focus:ring-zinc-950/20 focus:border-zinc-950'
              } text-xs rounded-sm text-zinc-900 shadow-2xs focus:outline-none focus:ring-1 font-mono transition-all`}
            />
            {suffix && (
              <span className="absolute right-3.5 text-xs text-zinc-400 font-sans font-medium pointer-events-none">
                {suffix}
              </span>
            )}
          </div>

          {/* Optional Range Slider */}
          {hasRangeSlider && (
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="range"
                min={min}
                max={max}
                step={step || 1}
                value={Number(value) || min || 0}
                onChange={handleNumberChange}
                className="flex-grow h-1 bg-zinc-200 rounded-sm appearance-none cursor-pointer accent-zinc-900"
                id={`slider-${id}`}
              />
              <span className="text-[10px] font-mono font-medium text-zinc-400">
                {min} - {max}
              </span>
            </div>
          )}
        </div>
      )}

      {type === 'date' && (
        <input
          type="date"
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `error-${id}` : undefined}
          className={`w-full py-2 px-3 bg-white border ${
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-zinc-200 focus:ring-zinc-950/20 focus:border-zinc-950'
          } text-xs rounded-sm text-zinc-900 shadow-2xs focus:outline-none focus:ring-1 font-sans transition-all`}
        />
      )}

      {type === 'boolean' && (
        <div className="flex items-center space-x-3 py-1">
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-zinc-950/20 ${
              value ? 'bg-zinc-950' : 'bg-zinc-200'
            }`}
            id={`toggle-${id}`}
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                value ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-xs font-medium text-zinc-600 font-sans">
            {value ? 'Yes / Enabled' : 'No / Disabled'}
          </span>
        </div>
      )}
    </div>
  );
}
