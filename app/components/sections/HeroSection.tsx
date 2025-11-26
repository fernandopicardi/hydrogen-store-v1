// Hero section - customize colors via Tailwind classes
// Overlay gradient and text colors can be adjusted for different backgrounds
import heroImage from '~/assets/hero-image.jpg';

interface HeroSectionProps {
  shop: {
    name: string;
    description?: string | null;
  };
  onShopNowClick?: () => void;
}

export function HeroSection({ shop, onShopNowClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Gradient Overlay - da esquerda até o centro para legibilidade do texto */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(3, 7, 18, 0.98) 0%, rgba(3, 7, 18, 0.9) 35%, rgba(3, 7, 18, 0.6) 50%, rgba(3, 7, 18, 0.2) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {shop.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            {shop.description || "Welcome to our custom Hydrogen Store."}
          </p>
          <button
            onClick={onShopNowClick}
            className="mt-2 sm:mt-4 w-fit px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm sm:text-base lg:text-lg uppercase tracking-wider rounded-lg hover:from-purple-600 hover:to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
}

