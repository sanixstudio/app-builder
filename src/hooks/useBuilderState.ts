import { useEffect, useState } from "react";
import { ComponentInstance, ComponentProps, DraggedComponent, Viewport } from "../app/types/builder";
import { clampDropPosition, snapToGrid } from "../app/lib/builder/dragDrop";
import { createComponentInstance } from "../app/lib/builder/componentFactory";
import { deleteComponent, moveComponent, resizeComponent, updateComponentProps } from "../app/lib/builder/componentMutations";

const STORAGE_KEY = "landing-page-builder-state";

export function useBuilderState() {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] =
    useState<DraggedComponent | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Landing Page");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [hasLoadedState, setHasLoadedState] = useState(false);

  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          components?: ComponentInstance[];
          viewport?: Viewport;
          pageTitle?: string;
          lastSavedAt?: number;
        };

        if (parsed.components) {
          setComponents(parsed.components);
        }

        if (parsed.viewport) {
          setViewport(parsed.viewport);
        }

        if (parsed.pageTitle) {
          setPageTitle(parsed.pageTitle);
        }

        setLastSavedAt(parsed.lastSavedAt ?? Date.now());
      }
    } catch {
      // ignore invalid storage data
    } finally {
      setHasLoadedState(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedState || typeof window === "undefined") return;

    const now = Date.now();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        components,
        viewport,
        pageTitle,
        lastSavedAt: now,
      })
    );

    setLastSavedAt(now);
  }, [components, viewport, pageTitle, hasLoadedState]);

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

  const handleApplyTemplate = (template: "heroPage" | "landingPage") => {
    const newComponents: ComponentInstance[] = [];

    if (template === "heroPage") {
      newComponents.push(
        createComponentInstance({
          type: "hero",
          defaultProps: {
            title: "Launch your next landing page",
            subtitle: "Drag, drop, and customize every section in one workspace.",
            ctaText: "Get started",
            bgColor: "#2563eb",
          },
          x: 120,
          y: 120,
        })
      );
      newComponents.push(
        createComponentInstance({
          type: "footer",
          defaultProps: {
            copyright: "© 2026 Your Company",
            links: ["Privacy", "Terms", "Contact"],
          },
          x: 120,
          y: 660,
        })
      );
    }

    if (template === "landingPage") {
      newComponents.push(
        createComponentInstance({
          type: "navbar",
          defaultProps: {
            logo: "Acme",
            links: ["Home", "Features", "Pricing", "Contact"],
          },
          x: 120,
          y: 20,
        })
      );
      newComponents.push(
        createComponentInstance({
          type: "hero",
          defaultProps: {
            title: "Create beautiful landing pages",
            subtitle: "Build modern websites with a drag-and-drop editor and publish instantly.",
            ctaText: "Start free trial",
            bgColor: "#111827",
          },
          x: 120,
          y: 120,
        })
      );
      newComponents.push(
        createComponentInstance({
          type: "cta",
          defaultProps: {
            title: "Ready to launch?",
            description: "Bring your value proposition to life with a beautiful landing page.",
            buttonText: "Build now",
            bgColor: "#7c3aed",
          },
          x: 120,
          y: 660,
        })
      );
      newComponents.push(
        createComponentInstance({
          type: "footer",
          defaultProps: {
            copyright: "© 2026 Your Company",
            links: ["Privacy", "Terms", "Contact"],
          },
          x: 120,
          y: 1080,
        })
      );
    }

    setComponents((prev) => [...prev, ...newComponents]);
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
    pageTitle,
    lastSavedAt,
    setViewport,
    setSelectedId,
    setIsPreviewOpen,
    setPageTitle,
    handleDragStart,
    handleDrop,
    handleDeleteComponent,
    handleUpdateComponent,
    handleMoveComponent,
    handleResizeComponent,
    handleApplyTemplate,
    handleClearAll,
  };
}