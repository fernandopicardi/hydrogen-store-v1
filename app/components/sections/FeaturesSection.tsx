import { useState, useEffect } from 'react';
import { SectionHeader } from './SectionHeader';

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  // Adicionar estilos CSS para animação
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'features-animation-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader
        title="Features &"
        titleHighlight="Benefits"
        subtitle="Everything you need for the best shopping experience"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gray-900 rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/30 cursor-pointer"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background effects container with overflow-hidden */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* Gradient overlay on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        
        {/* Shine effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out`}
          style={{ 
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {feature.icon && (
          <div 
            className={`text-4xl mb-4 text-purple-400 transition-all duration-500 origin-center ${
              isHovered 
                ? 'scale-125 rotate-12 text-pink-400' 
                : 'scale-100 rotate-0'
            }`}
            style={{
              filter: isHovered ? 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))' : 'none',
            }}
          >
            {feature.icon}
          </div>
        )}
        <h3 
          className={`text-xl font-bold mb-3 transition-colors duration-300 ${
            isHovered ? 'text-purple-400' : 'text-white'
          }`}
        >
          {feature.title}
        </h3>
        <p 
          className={`leading-relaxed transition-colors duration-300 ${
            isHovered ? 'text-gray-200' : 'text-gray-300'
          }`}
        >
          {feature.description}
        </p>
      </div>

      {/* Border glow effect */}
      <div 
        className={`absolute inset-0 rounded-xl border-2 transition-opacity duration-500 pointer-events-none ${
          isHovered 
            ? 'opacity-100 border-purple-500/50' 
            : 'opacity-0 border-transparent'
        }`}
      />
    </div>
  );
}

