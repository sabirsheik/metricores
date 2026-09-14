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
      className="bg-white border border-zinc-200 rounded-sm p-6 md:p-7 shadow-2xs"
      id="example-card"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sans block mb-2">
        Case Study
      </span>
      <h2 className="text-lg font-bold text-zinc-900 font-heading mb-4">
        Real Business Example
      </h2>
      <div className="space-y-4" id="example-details">
        <div className="flex items-start" id="example-scenario">
          <div className="border-l-2 border-zinc-950 pl-3 py-1">
            <h3 className="text-xs font-bold text-zinc-500 uppercase font-sans tracking-wide">
              Scenario
            </h3>
            <p className="text-sm text-zinc-600 font-sans leading-7 mt-2 italic">
              "{example.scenario}"
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase font-sans tracking-wide">
            Business Explanation
          </h3>
          <p className="text-sm text-zinc-700 font-sans leading-7 mt-2">
            {example.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
