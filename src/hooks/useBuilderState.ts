import { useState } from "react";
import { ComponentInstance, ComponentProps, DraggedComponent, Viewport } from "../app/types/builder";
import { clampDropPosition, snapToGrid } from "../app/lib/builder/dragDrop";
import { createComponentInstance } from "../app/lib/builder/componentFactory";
import { deleteComponent, moveComponent, resizeComponent, updateComponentProps } from "../app/lib/builder/componentMutations";

export function useBuilderState() {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] =
    useState<DraggedComponent | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  const handleDragStart = (
    type: string,
    defaultProps: ComponentProps,
    e: React.DragEvent,
  ) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", type);
    setDraggedComponent({ type, defaultProps });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedComponent) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const rawX = snapToGrid(e.clientX - canvasRect.left);
    const rawY = snapToGrid(e.clientY - canvasRect.top);
    const { x, y } = clampDropPosition(rawX, rawY, viewport);

    const newComponent = createComponentInstance({
      type: draggedComponent.type,
      defaultProps: draggedComponent.defaultProps,
      x,
      y,
    });

    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(newComponent.id);
    setDraggedComponent(null);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => deleteComponent(prev, id));
    setSelectedId((prev) => (prev === id ? null : prev));
  };

  const handleUpdateComponent = (id: string, newProps: ComponentProps) => {
    setComponents((prev) => updateComponentProps(prev, id, newProps));
  };

  const handleMoveComponent = (id: string, x: number, y: number) => {
    setComponents((prev) => moveComponent(prev, id, x, y));
  };

  const handleResizeComponent = (id: string, width: number, height: number) => {
    setComponents((prev) => resizeComponent(prev, id, width, height));
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all components?")) {
      setComponents([]);
      setSelectedId(null);
    }
  };

  return {
    components,
    selectedId,
    selectedComponent,
    viewport,
    isPreviewOpen,
    setViewport,
    setSelectedId,
    setIsPreviewOpen,
    handleDragStart,
    handleDrop,
    handleDeleteComponent,
    handleUpdateComponent,
    handleMoveComponent,
    handleResizeComponent,
    handleClearAll,
  };
}