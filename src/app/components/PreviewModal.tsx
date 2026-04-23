import { ComponentInstance } from "../types";
import { VIEWPORT_SIZES } from "../../config/builder";
import { renderComponent } from "./renderers";

interface PreviewModalProps {
  open: boolean;
  viewport: "desktop" | "mobile";
  components: ComponentInstance[];
  onClose: () => void;
}

export function PreviewModal({
  open,
  viewport,
  components,
  onClose,
}: PreviewModalProps) {
  if (!open) return null;

  const viewportSize = VIEWPORT_SIZES[viewport];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 flex justify-center items-center max-h-[90vh] w-[95vw] max-w-[1600px] flex-col overflow-auto rounded-lg bg-white shadow-xl">
          <div className="flex justify-between gap-2">
            <h2 className="text-lg font-semibold">Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                className="h-6 w-6"
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
        </div>
        <div className="flex-1 overflow-auto">
          <div className="inline-block rounded-lg border bg-gray-100">
            <div
              className="relative bg-white"
              style={{
                width: `${viewportSize.width}px`,
                height: `${viewportSize.height}px`,
              }}
            >
              {components.map((component) => (
                <div
                  key={component.id}
                  className="absolute"
                  style={{
                    left: `${component.position.x}px`,
                    top: `${component.position.y}px`,
                    width: `${component.size.width}px`,
                    height: `${component.size.height}px`,
                  }}
                >
                  {renderComponent(component.type, component.props)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
