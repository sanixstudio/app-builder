import { Layers, Download, Trash2, Eye, Monitor, Smartphone } from 'lucide-react';

interface ToolbarProps {
  onClearAll: () => void;
  onExportHTML: () => void;
  componentCount: number;
  viewport: 'desktop' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
  onPreview: () => void;
}

export function Toolbar({ onClearAll, onExportHTML, componentCount, viewport, onViewportChange, onPreview }: ToolbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          <h1 className="font-bold text-xl">Landing Page Builder</h1>
        </div>
        <div className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          {componentCount} {componentCount === 1 ? 'component' : 'components'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Viewport Toggle Buttons */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewportChange('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              viewport === 'desktop'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Desktop View (1440px)"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">Desktop</span>
          </button>
          <button
            onClick={() => onViewportChange('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              viewport === 'mobile'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Mobile</span>
          </button>
        </div>

        {/* Preview Button */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={onExportHTML}
          disabled={componentCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export HTML
        </button>

        <button
          onClick={onClearAll}
          disabled={componentCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </header>
  );
}
