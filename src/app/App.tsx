import { useState, useRef } from 'react';
import { ComponentLibrary } from './components/ComponentLibrary';
import { Canvas, GRID_SIZE } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { ComponentInstance } from './types';
import { Monitor, Smartphone, Eye } from 'lucide-react';

const DEFAULT_COMPONENT_SIZE = {
  heading1: { width: 400, height: 80 },
  heading2: { width: 400, height: 60 },
  heading3: { width: 400, height: 60 },
  paragraph: { width: 400, height: 120 },
  link: { width: 200, height: 40 },
  section: { width: 800, height: 400 },
  container: { width: 600, height: 300 },
  columns: { width: 800, height: 300 },
  grid: { width: 600, height: 400 },
  spacer: { width: 400, height: 60 },
  button: { width: 200, height: 60 },
  image: { width: 400, height: 300 },
  video: { width: 560, height: 315 },
  icon: { width: 100, height: 100 },
  divider: { width: 600, height: 40 },
  input: { width: 400, height: 100 },
  textarea: { width: 400, height: 180 },
  checkbox: { width: 400, height: 40 },
  form: { width: 500, height: 400 },
  hero: { width: 1000, height: 500 },
  feature: { width: 350, height: 300 },
  testimonial: { width: 400, height: 250 },
  cta: { width: 800, height: 400 },
  pricing: { width: 350, height: 600 },
  navbar: { width: 1200, height: 80 },
  footer: { width: 1200, height: 120 },
  team: { width: 300, height: 300 },
};

export default function App() {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<{ type: string; defaultProps: any } | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const VIEWPORT_SIZES = {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  };

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleDragStart = (type: string, defaultProps: any, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', type);
    setDraggedType({ type, defaultProps });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = snapToGrid(e.clientX - canvasRect.left);
    const y = snapToGrid(e.clientY - canvasRect.top);

    // Ensure drop is within canvas bounds
    const clampedX = Math.max(0, Math.min(x, VIEWPORT_SIZES.desktop.width - 100));
    const clampedY = Math.max(0, Math.min(y, VIEWPORT_SIZES.desktop.height - 100));

    if (draggedType) {
      const defaultSize = DEFAULT_COMPONENT_SIZE[draggedType.type as keyof typeof DEFAULT_COMPONENT_SIZE] || { width: 400, height: 200 };

      const newComponent: ComponentInstance = {
        id: `${draggedType.type}-${Date.now()}`,
        type: draggedType.type,
        props: draggedType.defaultProps,
        position: { x: clampedX, y: clampedY },
        size: defaultSize,
      };
      setComponents([...components, newComponent]);
      setSelectedId(newComponent.id);
      setDraggedType(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSelectComponent = (id: string) => {
    setSelectedId(id);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleUpdateComponent = (id: string, newProps: any) => {
    setComponents(
      components.map((c) =>
        c.id === id ? { ...c, props: newProps } : c
      )
    );
  };

  const handleMoveComponent = (id: string, x: number, y: number) => {
    setComponents(
      components.map((c) =>
        c.id === id ? { ...c, position: { x, y } } : c
      )
    );
  };

  const handleResizeComponent = (id: string, width: number, height: number) => {
    setComponents(
      components.map((c) =>
        c.id === id ? { ...c, size: { width, height } } : c
      )
    );
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all components?')) {
      setComponents([]);
      setSelectedId(null);
    }
  };

  const handleExportHTML = () => {
    const html = generateHTML(components);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedComponent = components.find((c) => c.id === selectedId) || null;

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <Toolbar
        onClearAll={handleClearAll}
        onExportHTML={handleExportHTML}
        componentCount={components.length}
        viewport={viewport}
        onViewportChange={setViewport}
        onPreview={() => setShowPreview(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary onDragStart={handleDragStart} />

        <Canvas
          components={components}
          selectedId={selectedId}
          onSelectComponent={handleSelectComponent}
          onDeselectComponent={() => setSelectedId(null)}
          onDeleteComponent={handleDeleteComponent}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMoveComponent={handleMoveComponent}
          onResizeComponent={handleResizeComponent}
          viewport={viewport}
          viewportSize={VIEWPORT_SIZES[viewport]}
        />

        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div
                className="relative bg-white"
                style={{
                  width: viewport === 'desktop' ? '100%' : '390px',
                  margin: viewport === 'mobile' ? '0 auto' : '0',
                  border: viewport === 'mobile' ? '1px solid #e5e7eb' : 'none',
                  borderRadius: viewport === 'mobile' ? '8px' : '0',
                  minHeight: '500px',
                }}
              >
                {components.length === 0 ? (
                  <div className="text-center text-gray-400 py-20">No components to preview</div>
                ) : (
                  components.map((component) => (
                    <div
                      key={component.id}
                      style={{
                        position: 'absolute',
                        left: component.position.x,
                        top: component.position.y,
                        width: component.size.width,
                        height: component.size.height,
                      }}
                    >
                      <PreviewComponent component={component} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preview component renderer
function PreviewComponent({ component }: { component: ComponentInstance }) {
  const { type, props } = component;
  
  switch (type) {
    case 'heading1':
      return <h1 style={{ textAlign: props.align, color: props.color }}>{props.text}</h1>;
    case 'heading2':
      return <h2 style={{ textAlign: props.align, color: props.color }}>{props.text}</h2>;
    case 'heading3':
      return <h3 style={{ textAlign: props.align, color: props.color }}>{props.text}</h3>;
    case 'paragraph':
      return <p style={{ textAlign: props.align, color: props.color }}>{props.text}</p>;
    case 'link':
      return <a href={props.url} style={{ color: props.color, textDecoration: props.underline ? 'underline' : 'none' }}>{props.text}</a>;
    case 'button':
      return (
        <button style={{
          width: '100%',
          height: '100%',
          backgroundColor: props.variant === 'primary' ? '#2563eb' : '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}>
          {props.text}
        </button>
      );
    case 'image':
      return (
        <img
          src={props.src}
          alt={props.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: props.rounded ? '0.5rem' : '0',
          }}
        />
      );
    case 'section':
      return (
        <div style={{ backgroundColor: props.bgColor, padding: `${props.padding}px`, width: '100%', height: '100%' }}>
          Section Content
        </div>
      );
    case 'container':
      return (
        <div style={{ padding: `${props.padding}px`, width: '100%', height: '100%' }}>
          Container
        </div>
      );
    case 'spacer':
      return <div style={{ height: `${props.height}px` }} />;
    case 'divider':
      return <hr style={{ borderColor: props.color, borderWidth: props.thickness }} />;
    default:
      return <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>{type}</div>;
  }
}

function generateHTML(components: ComponentInstance[]): string {
  const componentHTML = components.map((comp) => {
    const { type, props, position, size } = comp;
    const style = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;`;

    switch (type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return `<${props.level} style="${style} text-align: ${props.align}; color: ${props.color};">${props.text}</${props.level}>`;

      case 'paragraph':
        return `<p style="${style} text-align: ${props.align}; color: ${props.color};">${props.text}</p>`;

      case 'link':
        return `<a href="${props.url}" style="${style} color: ${props.color}; text-decoration: ${props.underline ? 'underline' : 'none'};">${props.text}</a>`;

      case 'button':
        return `<a href="${props.url}" style="${style} display: flex; align-items: center; justify-content: center; background-color: #2563eb; color: white; border-radius: 0.5rem; text-decoration: none;">${props.text}</a>`;

      case 'image':
        return `<img src="${props.src}" alt="${props.alt}" style="${style} object-fit: cover; ${props.rounded ? 'border-radius: 0.5rem;' : ''}" />`;

      case 'section':
        return `<section style="${style} background-color: ${props.bgColor}; padding: ${props.padding}px;"><!-- Section content --></section>`;

      default:
        return `<!-- ${type} component -->`;
    }
  }).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; position: relative; min-height: 2000px; }
  </style>
</head>
<body>
  <main>
    ${componentHTML}
  </main>
</body>
</html>`;
}
