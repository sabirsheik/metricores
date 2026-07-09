import React from 'react';

interface ExampleSectionProps {
  example: {
    scenario: string;
    explanation: string;
  };
}

export default function ExampleSection({ example }: ExampleSectionProps) {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs"
      id="example-card"
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans block mb-1">
        Case Study
      </span>
      <h2 className="text-sm font-bold text-zinc-900 font-heading mb-3">
        Real Business Example
      </h2>
      <div className="space-y-4" id="example-details">
        <div className="flex items-start" id="example-scenario">
          <div className="border-l-2 border-zinc-950 pl-3 py-1">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase font-sans tracking-wide">
              Scenario
            </h3>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-1 italic">
              "{example.scenario}"
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase font-sans tracking-wide">
            Business Explanation
          </h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed mt-1">
            {example.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
