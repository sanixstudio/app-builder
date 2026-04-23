
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
  } = useBuilderState();

  const handleExportHTML = () => {
    const html = generateHTML(components);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <Toolbar
        onClearAll={handleClearAll}
        onExportHTML={handleExportHTML}
        componentCount={components.length}
        viewport={viewport}
        onViewportChange={setViewport}
        onPreview={() => setIsPreviewOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary onDragStart={handleDragStart} />

        <Canvas
          components={components}
          selectedId={selectedId}
          onSelectComponent={setSelectedId}
          onDeselectComponent={() => setSelectedId(null)}
          onDeleteComponent={handleDeleteComponent}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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