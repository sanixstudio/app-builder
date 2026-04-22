import { ComponentInstance } from '../types';
import { Trash2, Star, Zap, Award, Heart, TrendingUp, Shield, Move, Maximize2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface CanvasComponentProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  gridSize: number;
}

const iconMap = {
  star: Star,
  zap: Zap,
  award: Award,
  heart: Heart,
  trending: TrendingUp,
  shield: Shield,
};

export function CanvasComponent({ component, isSelected, onSelect, onDelete, onMove, onResize, gridSize }: CanvasComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, componentX: 0, componentY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      componentX: component.position.x,
      componentY: component.position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      const newX = snapToGrid(dragStartPos.current.componentX + deltaX);
      const newY = snapToGrid(dragStartPos.current.componentY + deltaY);
      onMove(Math.max(0, newX), Math.max(0, newY));
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;
      const newWidth = snapToGrid(Math.max(100, resizeStartPos.current.width + deltaX));
      const newHeight = snapToGrid(Math.max(60, resizeStartPos.current.height + deltaY));
      onResize(newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: component.size.width,
      height: component.size.height,
    };
  };

  useState(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  });

  if (isDragging || isResizing) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  } else {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  const renderComponent = () => {
    const { type, props } = component;

    switch (type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        const HeadingTag = props.level as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={{ textAlign: props.align, color: props.color }}
          >
            {props.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p
            className="leading-relaxed"
            style={{ textAlign: props.align, color: props.color }}
          >
            {props.text}
          </p>
        );

      case 'link':
        return (
          <a
            href={props.url}
            style={{ color: props.color, textDecoration: props.underline ? 'underline' : 'none' }}
            className="hover:opacity-80 transition-opacity"
          >
            {props.text}
          </a>
        );

      case 'section':
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

      case 'container':
        return (
          <div
            className="h-full"
            style={{
              padding: `${props.padding}px`,
              backgroundColor: props.bgColor,
            }}
          >
            <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded h-full flex items-center justify-center">
              Container
            </div>
          </div>
        );

      case 'columns':
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

      case 'grid':
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

      case 'spacer':
        return <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">Spacer</div>;

      case 'button':
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

      case 'image':
        return (
          <img
            src={props.src}
            alt={props.alt}
            className={`w-full h-full object-cover ${props.rounded ? 'rounded-lg' : ''}`}
          />
        );

      case 'video':
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

      case 'icon':
        const IconComponent = iconMap[props.iconType as keyof typeof iconMap] || Star;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent
              style={{ width: `${props.size}px`, height: `${props.size}px`, color: props.color }}
            />
          </div>
        );

      case 'divider':
        return (
          <hr className="w-full" style={{ borderColor: props.color, borderWidth: `${props.thickness}px` }} />
        );

      case 'input':
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

      case 'textarea':
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

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-700">{props.label}</span>
          </label>
        );

      case 'form':
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

      case 'hero':
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

      case 'feature':
        const FeatureIcon = iconMap[props.icon as keyof typeof iconMap] || Zap;
        return (
          <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow h-full">
            <FeatureIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="mb-2">{props.title}</h3>
            <p className="text-gray-600">{props.description}</p>
          </div>
        );

      case 'testimonial':
        return (
          <div className="p-6 bg-white rounded-lg border border-gray-200 h-full flex flex-col justify-between">
            <p className="text-lg italic mb-4 text-gray-700">"{props.quote}"</p>
            <div>
              <p className="font-medium">{props.author}</p>
              <p className="text-sm text-gray-600">{props.role}</p>
            </div>
          </div>
        );

      case 'cta':
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

      case 'pricing':
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

      case 'navbar':
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

      case 'footer':
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

      case 'team':
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

      default:
        return <div className="text-red-500">Unknown: {type}</div>;
    }
  };

  return (
    <div
      className={`absolute cursor-move transition-shadow ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-gray-300'
      } ${isDragging ? 'opacity-70' : ''} bg-white`}
      style={{
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      <div className="w-full h-full overflow-hidden p-2">
        {renderComponent()}
      </div>

      {isSelected && (
        <>
          <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs flex items-center justify-between -mt-6">
            <div className="flex items-center gap-1">
              <Move className="w-3 h-3" />
              <span className="capitalize">{component.type}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="hover:bg-blue-700 p-0.5 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          <div
            className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-600 cursor-nwse-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <Maximize2 className="w-3 h-3 text-white" />
          </div>
        </>
      )}
    </div>
  );
}
