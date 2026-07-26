"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-slate-900">{item.question}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 shrink-0 text-slate-400 transition-transform',
                  isOpen && 'rotate-180 text-indigo-600'
                )}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
