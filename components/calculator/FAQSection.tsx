import React from 'react';
import FAQAccordion from '../FAQAccordion';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mb-12 border-t border-zinc-200 pt-10" id="faq-section">
      <div className="text-center md:text-left mb-6" id="faq-header">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans block mb-1">
          Questions & Answers
        </span>
        <h2 className="text-xl font-bold text-zinc-900 font-heading">
          Frequently Asked Questions
        </h2>
      </div>
      <FAQAccordion items={faqs} />
    </div>
  );
}
