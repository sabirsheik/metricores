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
      className="bg-white border border-zinc-200 rounded-sm p-6 md:p-7 shadow-2xs"
      id="formula-card"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sans block mb-2">
        Calculation Formula
      </span>
      <h2 className="text-lg font-bold text-zinc-900 font-heading mb-4">
        Formula Definition
      </h2>
      <div
        className="bg-zinc-50 px-4 py-3.5 rounded-sm border border-zinc-200/80 font-mono text-sm text-zinc-950 mb-5 overflow-x-auto whitespace-nowrap"
        id="formula-equation"
      >
        {formula.equation}
      </div>
      <p className="text-sm text-zinc-600 font-sans leading-7 mb-5">
        {formula.description}
      </p>
      <ul className="space-y-3" id="formula-steps-list">
        {formula.steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start text-sm text-zinc-700 font-sans leading-6"
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
