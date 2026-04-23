
import { Toolbar } from "./components/Toolbar";
import { ComponentLibrary } from "./components/ComponentLibrary";
import { Canvas } from "./components/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { PreviewModal } from "./components/PreviewModal";

import { VIEWPORT_SIZES } from "../config/builder";
import { useBuilderState } from "../hooks/useBuilderState";
import { generateHTML } from "./lib/builder/exportHtml";

export default function App() {
  const {
    components,
    selectedId,
    selectedComponent,
    viewport,
    isPreviewOpen,
    pageTitle,
    lastSavedAt,
    dragPreview,
    canvasExpansion,
    snappingGuides,
    canUndo,
    canRedo,
    setViewport,
    setSelectedId,
    setIsPreviewOpen,
    setPageTitle,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleSnappingGuidesChange,
    handleDrop,
    handleDeleteComponent,
    handleUpdateComponent,
    handleMoveComponent,
    handleResizeComponent,
    handleApplyTemplate,
    handleClearAll,
    undo,
    redo,
  } = useBuilderState();

  const handleExportHTML = () => {
    const html = generateHTML(components, pageTitle);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${pageTitle.replace(/\s+/g, "-").toLowerCase() || "landing-page"}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <Toolbar
        pageTitle={pageTitle}
        onPageTitleChange={setPageTitle}
        lastSavedAt={lastSavedAt}
        onClearAll={handleClearAll}
        onExportHTML={handleExportHTML}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        componentCount={components.length}
        viewport={viewport}
        onViewportChange={setViewport}
        onPreview={() => setIsPreviewOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary onDragStart={handleDragStart} onApplyTemplate={handleApplyTemplate} />

        <Canvas
          components={components}
          selectedId={selectedId}
          dragPreview={dragPreview}
          canvasExpansion={canvasExpansion}
          snappingGuides={snappingGuides}
          onSelectComponent={setSelectedId}
          onDeselectComponent={() => setSelectedId(null)}
          onDeleteComponent={handleDeleteComponent}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onSnappingGuidesChange={handleSnappingGuidesChange}
          onMoveComponent={handleMoveComponent}
          onResizeComponent={handleResizeComponent}
          viewport={viewport}
          viewportSize={VIEWPORT_SIZES[viewport]}
        />

        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
        />
      </div>

      <PreviewModal
        open={isPreviewOpen}
        viewport={viewport}
        components={components}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}