import { ComponentInstance } from '../types';
import { Trash2, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { renderComponent } from './renderers';

interface CanvasComponentProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  gridSize: number;
}

export function CanvasComponent({ component, isSelected, onSelect, onDelete, onMove, onResize, gridSize }: CanvasComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, componentX: 0, componentY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    e.preventDefault();
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

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      className={`absolute cursor-move transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-xl z-10'
          : 'hover:ring-1 hover:ring-gray-300 hover:shadow-md'
      } ${isDragging ? 'opacity-80' : ''}`}
      style={{
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="w-full h-full">
        {renderComponent(component.type, component.props)}
      </div>

      {isSelected && (
        <>
          {/* Delete button at top-right corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md transition-colors z-20"
            title="Delete component"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Resize handle at bottom-right */}
          <div
            className="resize-handle absolute bottom-0 right-0 w-5 h-5 bg-white border-2 border-blue-500 cursor-nwse-resize rounded-tl-md hover:bg-blue-50"
            onMouseDown={handleResizeMouseDown}
          >
            <Maximize2 className="w-3 h-3 text-blue-500 absolute bottom-0.5 right-0.5" />
          </div>
        </>
      )}
    </div>
  );
}
