// Section header component - customize colors via Tailwind classes
// Primary text: text-gray-900, highlight: text-purple-600, subtitle: text-gray-600
interface SectionHeaderProps {
  title: string;
  titleHighlight?: string; // Highlighted portion of the title
  subtitle: string;
}

export function SectionHeader({ title, titleHighlight, subtitle }: SectionHeaderProps) {
  return (
    <>
      <style>{`
        .section-header-title {
          font-size: 2.25rem; /* 36px - mobile */
        }
        @media (min-width: 640px) {
          .section-header-title {
            font-size: 3rem; /* 48px - sm */
          }
        }
        @media (min-width: 768px) {
          .section-header-title {
            font-size: 3rem; /* 48px - md */
          }
        }
        @media (min-width: 1024px) {
          .section-header-title {
            font-size: 3.75rem; /* 60px - lg desktop */
          }
        }
      `}</style>
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
        <div className="w-full text-center flex flex-col">
          {titleHighlight ? (
            <h2 
              className="section-header-title font-medium uppercase leading-tight tracking-tight"
            >
              <span className="text-gray-900">{title}</span>{' '}
              <span className="text-purple-600">{titleHighlight}</span>
            </h2>
          ) : (
            <h2 
              className="section-header-title font-medium uppercase leading-tight tracking-tight text-gray-900"
            >
              {title}
            </h2>
          )}
        </div>
        <p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-600 leading-relaxed text-center px-4 sm:px-0"
        >
          {subtitle}
        </p>
      </div>
    </>
  );
}

