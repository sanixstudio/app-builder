import { ComponentInstance } from '../types';

interface PropertiesPanelProps {
  selectedComponent: ComponentInstance | null;
  onUpdateComponent: (id: string, props: any) => void;
}

export function PropertiesPanel({ selectedComponent, onUpdateComponent }: PropertiesPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h2 className="mb-4 font-semibold">Properties</h2>
        <p className="text-sm text-gray-500">Select a component to edit its properties</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [key]: value,
    });
  };

  const handleArrayChange = (key: string, index: number, value: string) => {
    const newArray = [...selectedComponent.props[key]];
    newArray[index] = value;
    handleChange(key, newArray);
  };

  const addArrayItem = (key: string) => {
    handleChange(key, [...selectedComponent.props[key], '']);
  };

  const removeArrayItem = (key: string, index: number) => {
    const newArray = selectedComponent.props[key].filter((_: any, i: number) => i !== index);
    handleChange(key, newArray);
  };

  const renderFields = () => {
    const { type, props } = selectedComponent;

    switch (type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return (
          <>
            <FormGroup label="Text">
              <input
                type="text"
                value={props.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Level">
              <select value={props.level} onChange={(e) => handleChange('level', e.target.value)} className="form-input">
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
            </FormGroup>
            <FormGroup label="Alignment">
              <select value={props.align} onChange={(e) => handleChange('align', e.target.value)} className="form-input">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </FormGroup>
            <FormGroup label="Color">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
          </>
        );

      case 'paragraph':
        return (
          <>
            <FormGroup label="Text">
              <textarea
                value={props.text}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={4}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Alignment">
              <select value={props.align} onChange={(e) => handleChange('align', e.target.value)} className="form-input">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </FormGroup>
            <FormGroup label="Color">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
          </>
        );

      case 'link':
        return (
          <>
            <FormGroup label="Text">
              <input
                type="text"
                value={props.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="URL">
              <input
                type="text"
                value={props.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Color">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
            <FormGroup label="Underline">
              <input
                type="checkbox"
                checked={props.underline}
                onChange={(e) => handleChange('underline', e.target.checked)}
                className="w-4 h-4"
              />
            </FormGroup>
          </>
        );

      case 'section':
        return (
          <>
            <FormGroup label="Background Color">
              <input
                type="color"
                value={props.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
            <FormGroup label="Padding (px)">
              <input
                type="number"
                value={props.padding}
                onChange={(e) => handleChange('padding', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Full Width">
              <input
                type="checkbox"
                checked={props.fullWidth}
                onChange={(e) => handleChange('fullWidth', e.target.checked)}
                className="w-4 h-4"
              />
            </FormGroup>
          </>
        );

      case 'container':
        return (
          <>
            <FormGroup label="Max Width (px)">
              <input
                type="number"
                value={props.maxWidth}
                onChange={(e) => handleChange('maxWidth', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Padding (px)">
              <input
                type="number"
                value={props.padding}
                onChange={(e) => handleChange('padding', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Background Color">
              <input
                type="text"
                value={props.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="form-input"
                placeholder="transparent"
              />
            </FormGroup>
          </>
        );

      case 'columns':
        return (
          <>
            <FormGroup label="Number of Columns">
              <input
                type="number"
                min="1"
                max="6"
                value={props.columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Gap (px)">
              <input
                type="number"
                value={props.gap}
                onChange={(e) => handleChange('gap', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'grid':
        return (
          <>
            <FormGroup label="Columns">
              <input
                type="number"
                min="1"
                max="6"
                value={props.columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Gap (px)">
              <input
                type="number"
                value={props.gap}
                onChange={(e) => handleChange('gap', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'spacer':
        return (
          <FormGroup label="Height (px)">
            <input
              type="number"
              value={props.height}
              onChange={(e) => handleChange('height', e.target.value)}
              className="form-input"
            />
          </FormGroup>
        );

      case 'button':
        return (
          <>
            <FormGroup label="Text">
              <input
                type="text"
                value={props.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="URL">
              <input
                type="text"
                value={props.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Variant">
              <select value={props.variant} onChange={(e) => handleChange('variant', e.target.value)} className="form-input">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </FormGroup>
            <FormGroup label="Size">
              <select value={props.size} onChange={(e) => handleChange('size', e.target.value)} className="form-input">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </FormGroup>
          </>
        );

      case 'image':
        return (
          <>
            <FormGroup label="Image URL">
              <input
                type="text"
                value={props.src}
                onChange={(e) => handleChange('src', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Alt Text">
              <input
                type="text"
                value={props.alt}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Width">
              <input
                type="text"
                value={props.width}
                onChange={(e) => handleChange('width', e.target.value)}
                className="form-input"
                placeholder="100%"
              />
            </FormGroup>
            <FormGroup label="Rounded">
              <input
                type="checkbox"
                checked={props.rounded}
                onChange={(e) => handleChange('rounded', e.target.checked)}
                className="w-4 h-4"
              />
            </FormGroup>
          </>
        );

      case 'video':
        return (
          <>
            <FormGroup label="Video URL">
              <input
                type="text"
                value={props.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="form-input"
                placeholder="YouTube embed URL"
              />
            </FormGroup>
            <FormGroup label="Aspect Ratio">
              <select value={props.aspectRatio} onChange={(e) => handleChange('aspectRatio', e.target.value)} className="form-input">
                <option value="16/9">16:9</option>
                <option value="4/3">4:3</option>
                <option value="1/1">1:1</option>
              </select>
            </FormGroup>
          </>
        );

      case 'icon':
        return (
          <>
            <FormGroup label="Icon Type">
              <select value={props.iconType} onChange={(e) => handleChange('iconType', e.target.value)} className="form-input">
                <option value="star">Star</option>
                <option value="zap">Zap</option>
                <option value="award">Award</option>
                <option value="heart">Heart</option>
                <option value="trending">Trending</option>
                <option value="shield">Shield</option>
              </select>
            </FormGroup>
            <FormGroup label="Size (px)">
              <input
                type="number"
                value={props.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Color">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
          </>
        );

      case 'divider':
        return (
          <>
            <FormGroup label="Color">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
            <FormGroup label="Thickness (px)">
              <input
                type="number"
                value={props.thickness}
                onChange={(e) => handleChange('thickness', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'input':
        return (
          <>
            <FormGroup label="Label">
              <input
                type="text"
                value={props.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Placeholder">
              <input
                type="text"
                value={props.placeholder}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Type">
              <select value={props.type} onChange={(e) => handleChange('type', e.target.value)} className="form-input">
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
              </select>
            </FormGroup>
            <FormGroup label="Required">
              <input
                type="checkbox"
                checked={props.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="w-4 h-4"
              />
            </FormGroup>
          </>
        );

      case 'textarea':
        return (
          <>
            <FormGroup label="Label">
              <input
                type="text"
                value={props.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Placeholder">
              <input
                type="text"
                value={props.placeholder}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Rows">
              <input
                type="number"
                value={props.rows}
                onChange={(e) => handleChange('rows', parseInt(e.target.value))}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'checkbox':
        return (
          <FormGroup label="Label">
            <input
              type="text"
              value={props.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="form-input"
            />
          </FormGroup>
        );

      case 'form':
        return (
          <>
            <FormGroup label="Submit Button Text">
              <input
                type="text"
                value={props.submitText}
                onChange={(e) => handleChange('submitText', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Action URL">
              <input
                type="text"
                value={props.action}
                onChange={(e) => handleChange('action', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'hero':
        return (
          <>
            <FormGroup label="Title">
              <input
                type="text"
                value={props.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Subtitle">
              <textarea
                value={props.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={2}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="CTA Button Text">
              <input
                type="text"
                value={props.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Background Color">
              <input
                type="color"
                value={props.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
          </>
        );

      case 'feature':
        return (
          <>
            <FormGroup label="Icon">
              <select value={props.icon} onChange={(e) => handleChange('icon', e.target.value)} className="form-input">
                <option value="star">Star</option>
                <option value="zap">Zap</option>
                <option value="award">Award</option>
                <option value="heart">Heart</option>
                <option value="trending">Trending</option>
                <option value="shield">Shield</option>
              </select>
            </FormGroup>
            <FormGroup label="Title">
              <input
                type="text"
                value={props.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Description">
              <textarea
                value={props.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'testimonial':
        return (
          <>
            <FormGroup label="Quote">
              <textarea
                value={props.quote}
                onChange={(e) => handleChange('quote', e.target.value)}
                rows={3}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Author">
              <input
                type="text"
                value={props.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Role">
              <input
                type="text"
                value={props.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      case 'cta':
        return (
          <>
            <FormGroup label="Title">
              <input
                type="text"
                value={props.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Description">
              <textarea
                value={props.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Button Text">
              <input
                type="text"
                value={props.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Background Color">
              <input
                type="color"
                value={props.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </FormGroup>
          </>
        );

      case 'pricing':
        return (
          <>
            <FormGroup label="Plan Title">
              <input
                type="text"
                value={props.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Price">
              <input
                type="text"
                value={props.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Period">
              <input
                type="text"
                value={props.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Features">
              {props.features.map((feature: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    className="form-input flex-1"
                  />
                  <button
                    onClick={() => removeArrayItem('features', index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('features')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Add Feature
              </button>
            </FormGroup>
          </>
        );

      case 'navbar':
        return (
          <>
            <FormGroup label="Logo Text">
              <input
                type="text"
                value={props.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Navigation Links">
              {props.links.map((link: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleArrayChange('links', index, e.target.value)}
                    className="form-input flex-1"
                  />
                  <button
                    onClick={() => removeArrayItem('links', index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('links')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Add Link
              </button>
            </FormGroup>
          </>
        );

      case 'footer':
        return (
          <>
            <FormGroup label="Copyright Text">
              <input
                type="text"
                value={props.copyright}
                onChange={(e) => handleChange('copyright', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Footer Links">
              {props.links.map((link: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleArrayChange('links', index, e.target.value)}
                    className="form-input flex-1"
                  />
                  <button
                    onClick={() => removeArrayItem('links', index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('links')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Add Link
              </button>
            </FormGroup>
          </>
        );

      case 'team':
        return (
          <>
            <FormGroup label="Name">
              <input
                type="text"
                value={props.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Role">
              <input
                type="text"
                value={props.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="form-input"
              />
            </FormGroup>
            <FormGroup label="Image URL">
              <input
                type="text"
                value={props.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="form-input"
              />
            </FormGroup>
          </>
        );

      default:
        return <p className="text-sm text-gray-500">No properties available</p>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto h-full">
      <h2 className="mb-4 font-semibold">Properties</h2>

      <div className="mb-4 pb-4 border-b border-gray-200 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Component Type</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm capitalize font-medium">
            {selectedComponent.type.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
            <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs">
              X: {selectedComponent.position.x}<br/>
              Y: {selectedComponent.position.y}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
            <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs">
              W: {selectedComponent.size.width}<br/>
              H: {selectedComponent.size.height}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {renderFields()}
      </div>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
