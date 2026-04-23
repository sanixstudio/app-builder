import { Layers, Download, Trash2, Eye, Monitor, Smartphone, CheckCircle } from 'lucide-react';

interface ToolbarProps {
  pageTitle: string;
  onPageTitleChange: (title: string) => void;
  lastSavedAt: number | null;
  onClearAll: () => void;
  onExportHTML: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  componentCount: number;
  viewport: 'desktop' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
  onPreview: () => void;
}

export function Toolbar({ pageTitle, onPageTitleChange, lastSavedAt, onClearAll, onExportHTML, onUndo, onRedo, canUndo, canRedo, componentCount, viewport, onViewportChange, onPreview }: ToolbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-bold text-xl">Landing Page Builder</h1>
              <p className="text-sm text-gray-500">Create responsive landing pages with drag-and-drop tools.</p>
            </div>
          </div>
          <div className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {componentCount} {componentCount === 1 ? 'component' : 'components'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="page-title">Page title</label>
          <input
            id="page-title"
            type="text"
            value={pageTitle}
            onChange={(e) => onPageTitleChange(e.target.value)}
            className="w-72 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none"
            placeholder="Page title"
          />
          <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            {lastSavedAt ? `Saved ${Math.round((Date.now() - lastSavedAt) / 1000)}s ago` : 'Saving...'}
          </div>
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

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium">Undo</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium">Redo</span>
        </button>

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
