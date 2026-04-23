import { ComponentProps } from "../../types/builder";

interface ComponentRendererProps {
  props: ComponentProps;
}

export function HeadingRenderer({ props }: ComponentRendererProps) {
  const HeadingTag = props.level as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag style={{ textAlign: props.align, color: props.color }}>
      {props.text}
    </HeadingTag>
  );
}

export function ParagraphRenderer({ props }: ComponentRendererProps) {
  return (
    <p className="leading-relaxed" style={{ textAlign: props.align, color: props.color }}>
      {props.text}
    </p>
  );
}

export function LinkRenderer({ props }: ComponentRendererProps) {
  return (
    <a
      href={props.url}
      style={{ color: props.color, textDecoration: props.underline ? 'underline' : 'none' }}
      className="hover:opacity-80 transition-opacity"
    >
      {props.text}
    </a>
  );
}

export function SectionRenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: props.bgColor, padding: `${props.padding}px` }}
    >
      <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded h-full flex items-center justify-center">
        Section Container
      </div>
    </div>
  );
}

export function ContainerRenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="h-full"
      style={{ padding: `${props.padding}px`, backgroundColor: props.bgColor }}
    >
      <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded h-full flex items-center justify-center">
        Container
      </div>
    </div>
  );
}

export function ColumnsRenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gap: `${props.gap}px`,
        backgroundColor: props.bgColor,
      }}
    >
      {Array.from({ length: props.columns }).map((_, i) => (
        <div key={i} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-400">
          Col {i + 1}
        </div>
      ))}
    </div>
  );
}

export function GridRenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="h-full overflow-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gap: `${props.gap}px`,
        backgroundColor: props.bgColor,
      }}
    >
      {Array.from({ length: props.columns * 2 }).map((_, i) => (
        <div key={i} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-400">
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export function SpacerRenderer() {
  return <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">Spacer</div>;
}

export function ButtonRenderer({ props }: ComponentRendererProps) {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3 text-lg',
  };
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  return (
    <a
      href={props.url}
      className={`inline-block rounded-lg font-medium transition-colors ${sizeClasses[props.size as keyof typeof sizeClasses]} ${variantClasses[props.variant as keyof typeof variantClasses]}`}
    >
      {props.text}
    </a>
  );
}

export function ImageRenderer({ props }: ComponentRendererProps) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      className={`w-full h-full object-cover ${props.rounded ? 'rounded-lg' : ''}`}
    />
  );
}

export function VideoRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="w-full h-full">
      <iframe
        src={props.url}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function IconRenderer({ props }: ComponentRendererProps) {
  const iconMap = {
    star: '⭐',
    zap: '⚡',
    award: '🏆',
    heart: '❤️',
    trending: '📈',
    shield: '🛡️',
  };

  const icon = iconMap[props.iconType as keyof typeof iconMap] || '⭐';

  return (
    <div className="w-full h-full flex items-center justify-center text-4xl">
      {icon}
    </div>
  );
}

export function DividerRenderer({ props }: ComponentRendererProps) {
  return (
    <hr className="w-full" style={{ borderColor: props.color, borderWidth: `${props.thickness}px` }} />
  );
}

export function InputRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {props.label}
        {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function TextareaRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <textarea
        placeholder={props.placeholder}
        rows={props.rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function CheckboxRenderer({ props }: ComponentRendererProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
      <span className="text-sm text-gray-700">{props.label}</span>
    </label>
  );
}

export function FormRenderer({ props }: ComponentRendererProps) {
  return (
    <form className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200 h-full">
      <div className="text-sm text-gray-500">Form Container - Add inputs inside</div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {props.submitText}
      </button>
    </form>
  );
}

export function HeroRenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="text-white p-16 rounded-lg text-center h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: props.bgColor }}
    >
      <h1 className="mb-4">{props.title}</h1>
      <p className="text-xl mb-8 opacity-90">{props.subtitle}</p>
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
        {props.ctaText}
      </button>
    </div>
  );
}

export function FeatureRenderer({ props }: ComponentRendererProps) {
  const iconMap = {
    star: '⭐',
    zap: '⚡',
    award: '🏆',
    heart: '❤️',
    trending: '📈',
    shield: '🛡️',
  };

  const icon = iconMap[props.icon as keyof typeof iconMap] || '⚡';

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow h-full">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="mb-2">{props.title}</h3>
      <p className="text-gray-600">{props.description}</p>
    </div>
  );
}

export function TestimonialRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 h-full flex flex-col justify-between">
      <p className="text-lg italic mb-4 text-gray-700">"{props.quote}"</p>
      <div>
        <p className="font-medium">{props.author}</p>
        <p className="text-sm text-gray-600">{props.role}</p>
      </div>
    </div>
  );
}

export function CTARenderer({ props }: ComponentRendererProps) {
  return (
    <div
      className="text-white p-16 rounded-lg text-center h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: props.bgColor }}
    >
      <h2 className="mb-4">{props.title}</h2>
      <p className="text-lg mb-8 opacity-90">{props.description}</p>
      <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
        {props.buttonText}
      </button>
    </div>
  );
}

export function PricingRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="p-8 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors h-full flex flex-col">
      <h3 className="mb-2">{props.title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{props.price}</span>
        <span className="text-gray-600">{props.period}</span>
      </div>
      <ul className="space-y-3 mb-6 flex-1">
        {props.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
        Get Started
      </button>
    </div>
  );
}

export function NavbarRenderer({ props }: ComponentRendererProps) {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 h-full">
      <div className="font-bold text-xl">{props.logo}</div>
      <div className="flex gap-6">
        {props.links.map((link: string, i: number) => (
          <a key={i} href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function FooterRenderer({ props }: ComponentRendererProps) {
  return (
    <footer className="bg-gray-900 text-white p-8 rounded-lg h-full flex items-center">
      <div className="flex justify-between items-center w-full">
        <p className="text-gray-400">{props.copyright}</p>
        <div className="flex gap-6">
          {props.links.map((link: string, i: number) => (
            <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function TeamRenderer({ props }: ComponentRendererProps) {
  return (
    <div className="text-center h-full flex flex-col items-center justify-center">
      <img
        src={props.image}
        alt={props.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="mb-1">{props.name}</h3>
      <p className="text-gray-600">{props.role}</p>
    </div>
  );
}