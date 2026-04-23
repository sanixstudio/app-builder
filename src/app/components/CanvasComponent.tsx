import { ComponentInstance } from "../types";
import { Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { renderComponent } from "./renderers";
import { calculateSnappingGuides } from "../lib/builder/dragDrop";

interface CanvasComponentProps {
  component: ComponentInstance;
  allComponents: ComponentInstance[];
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  onSnappingGuidesChange: (guides: { vertical?: number; horizontal?: number } | null) => void;
}

export function CanvasComponent({
  component,
  allComponents,
  isSelected,
  onSelect,
  onDelete,
  onMove,
  onResize,
  gridSize,
  canvasWidth,
  canvasHeight,
  onSnappingGuidesChange,
}: CanvasComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartPos = useRef({ x: 0, y: 0, componentX: 0, componentY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".resize-handle")) return;

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

      const mouseX = dragStartPos.current.componentX + deltaX;
      const mouseY = dragStartPos.current.componentY + deltaY;

      // Get other components for snapping calculation
      const otherComponents = allComponents.filter(c => c.id !== component.id);

      // Calculate snapping position and guides
      const { x, y, guides } = calculateSnappingGuides(
        mouseX,
        mouseY,
        component.size.width,
        component.size.height,
        canvasWidth,
        canvasHeight,
        otherComponents
      );

      onSnappingGuidesChange(guides);
      onMove(x, y);
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      const rawWidth = Math.round((resizeStartPos.current.width + deltaX) / gridSize) * gridSize;
      const rawHeight = Math.round((resizeStartPos.current.height + deltaY) / gridSize) * gridSize;

      const clampedWidth = Math.max(gridSize, Math.min(rawWidth, canvasWidth - component.position.x));
      const clampedHeight = Math.max(gridSize, Math.min(rawHeight, canvasHeight - component.position.y));

      onResize(clampedWidth, clampedHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    onSnappingGuidesChange(null);
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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, component, canvasWidth, canvasHeight]);

  return (
    <div
      className={`absolute cursor-move transition-all ${
        isSelected
          ? "ring-2 ring-blue-500 shadow-xl z-10"
          : "hover:ring-1 hover:ring-gray-300 hover:shadow-md"
      } ${isDragging ? "opacity-80" : ""}`}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-3 -right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
            title="Delete component"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="resize-handle absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize rounded-tl-md border-2 border-blue-500 bg-white hover:bg-blue-50"
            onMouseDown={handleResizeMouseDown}
          >
            <Maximize2 className="absolute bottom-0.5 right-0.5 h-3 w-3 text-blue-500" />
          </div>
        </>
      )}
    </div>
  );
}
