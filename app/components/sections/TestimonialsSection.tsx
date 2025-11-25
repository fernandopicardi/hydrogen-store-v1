// Testimonials section - customize colors via Tailwind classes
// Card bg: bg-white, borders: border-gray-200, text: text-gray-900/700/600
import { useRef, useEffect, useState } from 'react';
import { SectionHeader } from './SectionHeader';

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldCenter, setShouldCenter] = useState(false);
  const [showArrows, setShowArrows] = useState(true);

  useEffect(() => {
    const checkAndCenter = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;
        
        // Se o conteúdo total cabe no container, centralizar com flexbox
        if (scrollWidth <= containerWidth) {
          setShouldCenter(true);
          setShowArrows(false);
        } else {
          setShouldCenter(false);
          setShowArrows(true);
          // Se não cabe, centralizar o primeiro card com scroll
          const cardWidth = 320; // w-80 = 320px
          const spacerWidth = (containerWidth - cardWidth) / 2;
          container.scrollLeft = spacerWidth;
        }
      }
    };

    // Aguardar renderização
    requestAnimationFrame(() => {
      setTimeout(checkAndCenter, 50);
      // Também verificar após resize
      window.addEventListener('resize', checkAndCenter);
    });

    return () => {
      window.removeEventListener('resize', checkAndCenter);
    };
  }, [testimonials]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader
        title="What Our"
        titleHighlight="Customers Say"
        subtitle="Real experiences from people who love our products"
      />
      
      <div className="relative">
        {/* Left Arrow - apenas quando há scroll */}
        {showArrows && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow - apenas quando há scroll */}
        {showArrows && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          className={`overflow-x-auto scrollbar-hide flex gap-6 pb-4 ${
            shouldCenter ? 'justify-center' : ''
          }`}
          style={{ 
            scrollSnapType: shouldCenter ? 'none' : 'x mandatory',
          }}
        >
          {/* Spacer para centralizar o primeiro card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
          
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300"
              style={{ scrollSnapAlign: shouldCenter ? 'none' : 'center' }}
            >
              {testimonial.rating && (
                <div className="flex mb-4 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < testimonial.rating! ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-900 font-bold">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Spacer para centralizar o último card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
        </div>
      </div>
    </div>
  );
}

