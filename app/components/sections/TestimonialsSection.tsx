import { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const centerFirstCard = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.clientWidth;
        const cardWidth = 320; // w-80 = 320px
        
        // Calcular scroll para centralizar o primeiro card
        // O spacer tem width: calc((100% - 320px) / 2), então precisamos scrollar essa quantidade
        const spacerWidth = (containerWidth - cardWidth) / 2;
        container.scrollLeft = spacerWidth;
      }
    };

    // Aguardar renderização
    requestAnimationFrame(() => {
      setTimeout(centerFirstCard, 50);
      // Também centralizar após resize
      window.addEventListener('resize', centerFirstCard);
    });

    return () => {
      window.removeEventListener('resize', centerFirstCard);
    };
  }, []);

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
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide flex gap-6 pb-4"
          style={{ 
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* Spacer para centralizar o primeiro card */}
          <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
          
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-gray-900 rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300"
              style={{ scrollSnapAlign: 'center' }}
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
              <p className="text-gray-300 leading-relaxed mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-white font-bold">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Spacer para centralizar o último card */}
          <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
        </div>
      </div>
    </div>
  );
}

