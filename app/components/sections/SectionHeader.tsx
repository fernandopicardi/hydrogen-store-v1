interface SectionHeaderProps {
  title: string;
  titleHighlight?: string; // Parte do título que será destacada
  subtitle: string;
}

export function SectionHeader({ title, titleHighlight, subtitle }: SectionHeaderProps) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 mb-12">
      <div className="w-full text-center flex flex-col">
        {titleHighlight ? (
          <h2 
            className="text-5xl md:text-6xl font-medium uppercase leading-[60px] tracking-tight"
            style={{ fontSize: '60px', lineHeight: '60px' }}
          >
            <span className="text-white">{title}</span>{' '}
            <span className="text-purple-400">{titleHighlight}</span>
          </h2>
        ) : (
          <h2 
            className="text-5xl md:text-6xl font-medium uppercase leading-[60px] tracking-tight text-white"
            style={{ fontSize: '60px', lineHeight: '60px' }}
          >
            {title}
          </h2>
        )}
      </div>
      <p 
        className="text-xl md:text-2xl font-medium text-gray-300 leading-8 text-center"
        style={{ fontSize: '24px', lineHeight: '32px' }}
      >
        {subtitle}
      </p>
    </div>
  );
}

