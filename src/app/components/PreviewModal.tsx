import { ComponentInstance } from '../types';
import { VIEWPORT_SIZES } from '../../config/builder';
import { renderComponent } from './renderers';

interface PreviewModalProps {
  open: boolean;
  viewport: 'desktop' | 'mobile';
  components: ComponentInstance[];
  onClose: () => void;
}

export function PreviewModal({ open, viewport, components, onClose }: PreviewModalProps) {
  if (!open) return null;

  const viewportSize = VIEWPORT_SIZES[viewport];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-4">
          <div
            className="bg-gray-100 rounded-lg mx-auto border"
            style={{
              width: `${viewportSize.width}px`,
              height: `${viewportSize.height}px`,
              maxWidth: '100%',
              maxHeight: '70vh',
              overflow: 'auto',
            }}
          >
            <div className="relative w-full h-full bg-white">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="absolute"
                  style={{
                    left: `${component.position.x}px`,
                    top: `${component.position.y}px`,
                    width: `${component.size.width}px`,
                    height: `${component.size.height}px`,
                  }}
                >
                  {renderComponent(component.type, component.props)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}