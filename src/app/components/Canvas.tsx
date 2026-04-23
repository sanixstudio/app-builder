import { ComponentInstance } from "../types";
import { CanvasComponent } from "./CanvasComponent";
import { useRef } from "react";
import { GRID_SIZE } from "../../config/builder";

interface CanvasProps {
  components: ComponentInstance[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeselectComponent: () => void;
  onDeleteComponent: (id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onMoveComponent: (id: string, x: number, y: number) => void;
  onResizeComponent: (id: string, width: number, height: number) => void;
  viewport: "desktop" | "mobile";
  viewportSize: { width: number; height: number };
}

export function Canvas({
  components,
  selectedId,
  onSelectComponent,
  onDeselectComponent,
  onDeleteComponent,
  onDrop,
  onDragOver,
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
    )
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

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-auto flex items-start justify-center">
      <div
        ref={canvasRef}
        className="canvas-area relative bg-white rounded-lg shadow-sm"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={handleCanvasClick}
        style={{
          width: viewportSize.width,
          minHeight: contentHeight,
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      >
        {viewport === "mobile" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-t-md">
            {viewportSize.width}px
          </div>
        )}

        {components.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
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
              component={component}
              isSelected={selectedId === component.id}
              onSelect={() => onSelectComponent(component.id)}
              onDelete={() => onDeleteComponent(component.id)}
              onMove={(x, y) => onMoveComponent(component.id, x, y)}
              onResize={(width, height) =>
                onResizeComponent(component.id, width, height)
              }
              gridSize={GRID_SIZE}
              canvasWidth={viewportSize.width}
              canvasHeight={viewportSize.height}
            />
          ))
        )}
      </div>
    </div>
  );
}
