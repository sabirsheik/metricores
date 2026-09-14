import React from 'react';
import { InputField as InputFieldType } from '../../types';
import { HelpCircle } from 'lucide-react';

interface SelectFieldProps {
  field: InputFieldType;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}

export default function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  const { id, label, options, tooltip } = field;

  return (
    <div className="space-y-1.5" id={`select-container-${id}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5"
          id={`select-label-${id}`}
        >
          {label}
          {tooltip && (
            <div className="relative group cursor-help" id={`select-tooltip-trigger-${id}`}>
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-lg z-50 font-sans font-normal leading-normal">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        {error && (
          <span className="text-[10px] font-semibold text-red-600 font-sans" id={`select-error-${id}`}>
            {error}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id={id}
          name={id}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `select-error-${id}` : undefined}
          className={`w-full min-h-11 py-2.5 px-3 bg-white border ${
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-zinc-200 focus:ring-zinc-950/20 focus:border-zinc-950'
          } text-xs rounded-sm text-zinc-900 shadow-2xs focus:outline-none focus:ring-1 font-sans transition-all appearance-none cursor-pointer`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
