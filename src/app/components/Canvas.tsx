import { ComponentInstance } from "../types";
import { CanvasComponent } from "./CanvasComponent";
import { useRef, useState } from "react";
import { GRID_SIZE } from "../../config/builder";

interface CanvasProps {
  components: ComponentInstance[];
  selectedId: string | null;
  dragPreview: { x: number; y: number; width: number; height: number } | null;
  canvasExpansion: number;
  snappingGuides: { vertical?: number; horizontal?: number } | null;
  onSelectComponent: (id: string) => void;
  onDeselectComponent: () => void;
  onDeleteComponent: (id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onSnappingGuidesChange: (guides: { vertical?: number; horizontal?: number } | null) => void;
  onMoveComponent: (id: string, x: number, y: number) => void;
  onResizeComponent: (id: string, width: number, height: number) => void;
  viewport: "desktop" | "mobile";
  viewportSize: { width: number; height: number };
}

export function Canvas({
  components,
  selectedId,
  dragPreview,
  canvasExpansion,
  snappingGuides,
  onSelectComponent,
  onDeselectComponent,
  onDeleteComponent,
  onDrop,
  onDragOver,
  onDragLeave,
  onSnappingGuidesChange,
  onMoveComponent,
  onResizeComponent,
  viewport,
  viewportSize,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const contentHeight = Math.max(
    viewportSize.height,
    components.reduce(
      (max, component) =>
        Math.max(max, component.position.y + component.size.height + GRID_SIZE),
      0
    ) + canvasExpansion
  );

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas (not on a component)
    if (
      e.target === canvasRef.current ||
      (e.target as HTMLElement).classList.contains("canvas-area")
    ) {
      onDeselectComponent();
    }
  };

  // Generate grid lines
  const gridLines = [];
  const numVerticalLines = Math.ceil(viewportSize.width / GRID_SIZE);
  const numHorizontalLines = Math.ceil(contentHeight / GRID_SIZE);

  // Vertical grid lines
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = i * GRID_SIZE;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={contentHeight}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }

  // Horizontal grid lines
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = i * GRID_SIZE;
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={y}
        x2={viewportSize.width}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-auto flex items-start justify-center">
      <div className="relative">
        {/* Grid SVG */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={viewportSize.width}
          height={contentHeight}
          style={{ zIndex: 0 }}
        >
          {gridLines}
        </svg>

        {/* Canvas area */}
        <div
          ref={canvasRef}
          className="canvas-area relative bg-transparent rounded-lg"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={handleCanvasClick}
          style={{
            width: viewportSize.width,
            minWidth: viewportSize.width,
            minHeight: contentHeight,
          }}
        >
          {viewport === "mobile" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-t-md z-10">
              {viewportSize.width}px
            </div>
          )}

          {components.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">
                  Drag components here to start building
                </div>
                <div className="text-gray-300 text-sm">
                  Components will snap to the grid automatically
                </div>
              </div>
            </div>
          ) : (
            components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                allComponents={components}
                isSelected={selectedId === component.id}
                onSelect={() => onSelectComponent(component.id)}
                onDelete={() => onDeleteComponent(component.id)}
                onMove={(x, y) => onMoveComponent(component.id, x, y)}
                onResize={(width, height) =>
                  onResizeComponent(component.id, width, height)
                }
                gridSize={GRID_SIZE}
                canvasWidth={viewportSize.width}
                canvasHeight={contentHeight}
                onSnappingGuidesChange={onSnappingGuidesChange}
              />
            ))
          )}

          {/* Drag preview */}
          {dragPreview && (
            <div
              className="absolute border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-30 pointer-events-none z-20"
              style={{
                left: `${dragPreview.x}px`,
                top: `${dragPreview.y}px`,
                width: `${dragPreview.width}px`,
                height: `${dragPreview.height}px`,
              }}
            />
          )}

          {/* Canvas expansion indicator */}
          {canvasExpansion > 0 && (
            <div
              className="absolute border-2 border-dashed border-green-400 bg-green-50 bg-opacity-50 pointer-events-none z-20"
              style={{
                left: 0,
                top: contentHeight - canvasExpansion,
                width: `${viewportSize.width}px`,
                height: `${canvasExpansion}px`,
              }}
            >
              <div className="flex items-center justify-center h-full text-green-600 text-sm font-medium">
                New Canvas Area
              </div>
            </div>
          )}

          {/* Snapping guides */}
          {snappingGuides && (
            <>
              {snappingGuides.vertical !== undefined && (
                <div
                  className="absolute bg-red-500 opacity-75 pointer-events-none z-30"
                  style={{
                    left: `${snappingGuides.vertical}px`,
                    top: 0,
                    width: '1px',
                    height: `${contentHeight}px`,
                  }}
                />
              )}
              {snappingGuides.horizontal !== undefined && (
                <div
                  className="absolute bg-red-500 opacity-75 pointer-events-none z-30"
                  style={{
                    left: 0,
                    top: `${snappingGuides.horizontal}px`,
                    width: `${viewportSize.width}px`,
                    height: '1px',
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
