// FAQ section - customize colors via Tailwind classes
// Card bg: bg-white, borders: border-gray-200, text: text-gray-900/700
import { useState } from 'react';
import { SectionHeader } from './SectionHeader';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <SectionHeader
        title="Frequently Asked"
        titleHighlight="Questions"
        subtitle="Find answers to common questions about our products and services"
      />
      
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-gray-900 font-bold text-base sm:text-lg pr-4">
                {faq.question}
              </span>
              <span className="text-purple-600 text-xl sm:text-2xl shrink-0">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

