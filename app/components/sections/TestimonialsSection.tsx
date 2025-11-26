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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
          // Card width: 280px em mobile (w-[280px]), 320px em sm e acima (w-80)
          const cardWidth = containerWidth < 640 ? 280 : 320;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={scrollContainerRef}
          role="group"
          aria-label="Testimonials carousel"
          className={`overflow-x-auto scrollbar-hide flex gap-6 pb-4 cursor-grab active:cursor-grabbing ${
            shouldCenter ? 'justify-center' : ''
          }`}
          style={{ 
            scrollSnapType: shouldCenter ? 'none' : 'x mandatory',
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Spacer para centralizar o primeiro card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="shrink-0 hidden sm:block" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
          
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="shrink-0 w-[280px] sm:w-80 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300"
              style={{ scrollSnapAlign: shouldCenter ? 'none' : 'center' }}
            >
              {testimonial.rating && (
                <div className="flex mb-3 sm:mb-4 text-yellow-400 text-sm sm:text-base">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < testimonial.rating! ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <p className="text-gray-900 font-bold text-sm sm:text-base">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Spacer para centralizar o último card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="shrink-0 hidden sm:block" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
        </div>
      </div>
    </div>
  );
}

