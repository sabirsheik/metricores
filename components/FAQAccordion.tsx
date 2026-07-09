import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '@/types';

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 w-full" id="faq-accordion-container">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-zinc-200 rounded-sm overflow-hidden bg-white transition-colors duration-200 shadow-2xs"
            id={`faq-item-${index}`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-900 hover:bg-zinc-50 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-950/10"
              id={`faq-btn-${index}`}
              aria-expanded={isOpen}
            >
              <span className="font-sans font-medium text-sm md:text-base">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                id={`faq-icon-${index}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="p-4 pt-0 text-sm text-zinc-600 font-sans border-t border-zinc-100 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
