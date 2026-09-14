import React from 'react';
import FAQAccordion from '../FAQAccordion';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mb-14 border-t border-zinc-200 pt-12" id="faq-section">
      <div className="text-center md:text-left mb-7" id="faq-header">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sans block mb-2">
          Questions & Answers
        </span>
        <h2 className="text-2xl font-bold text-zinc-900 font-heading">
          Frequently Asked Questions
        </h2>
      </div>
      <FAQAccordion items={faqs} />
    </div>
  );
}
