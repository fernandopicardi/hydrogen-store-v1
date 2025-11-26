// CTA section - customize colors via Tailwind classes
// Primary bg: bg-gray-50 or bg-white, buttons: bg-purple-600 or gradient
import { SectionHeader } from './SectionHeader';

interface CTASectionProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'primary' | 'secondary';
  onButtonClick?: () => void;
}

export function CTASection({
  title,
  titleHighlight,
  subtitle,
  buttonText,
  buttonLink,
  variant = 'primary',
  onButtonClick,
}: CTASectionProps) {
  const isPrimary = variant === 'primary';
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onButtonClick && buttonLink === '#') {
      e.preventDefault();
      onButtonClick();
    }
  };
  
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 ${isPrimary ? 'bg-gray-50 border border-gray-200 rounded-2xl my-12 sm:my-16 lg:my-20' : ''}`}>
      <div className="text-center max-w-3xl mx-auto">
        <SectionHeader
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
        <div className="mt-6 sm:mt-8">
        <a
          href={buttonLink}
          onClick={handleClick}
          className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            isPrimary
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50'
              : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 hover:border-purple-600'
          }`}
        >
          {buttonText}
        </a>
        </div>
      </div>
    </div>
  );
}

