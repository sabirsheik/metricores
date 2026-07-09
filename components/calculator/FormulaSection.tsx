import React from 'react';

interface FormulaSectionProps {
  formula: {
    equation: string;
    description: string;
    steps: string[];
  };
}

export default function FormulaSection({ formula }: FormulaSectionProps) {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs"
      id="formula-card"
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans block mb-1">
        Calculation Formula
      </span>
      <h2 className="text-sm font-bold text-zinc-900 font-heading mb-3">
        Formula Definition
      </h2>
      <div
        className="bg-zinc-50 px-4 py-3 rounded-sm border border-zinc-200/80 font-mono text-xs text-zinc-950 mb-4 overflow-x-auto whitespace-nowrap"
        id="formula-equation"
      >
        {formula.equation}
      </div>
      <p className="text-xs text-zinc-500 font-sans leading-relaxed mb-4">
        {formula.description}
      </p>
      <ul className="space-y-2" id="formula-steps-list">
        {formula.steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start text-[11px] text-zinc-600 font-sans leading-normal"
            id={`step-${idx}`}
          >
            <span className="text-zinc-900 font-bold font-sans mr-2 shrink-0">
              {idx + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
