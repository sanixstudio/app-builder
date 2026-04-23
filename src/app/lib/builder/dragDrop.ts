import { VIEWPORT_SIZES, GRID_SIZE } from "../../../config/builder";
import { Viewport } from "../../types/builder";

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function clampDropPosition(
  x: number,
  y: number,
  viewport: Viewport,
  padding = 100,
): { x: number; y: number } {
  const bounds = VIEWPORT_SIZES[viewport];

  return {
    x: Math.max(0, Math.min(x, bounds.width - padding)),
    y: Math.max(0, y),
  };
}

export function calculateSnappingGuides(
  mouseX: number,
  mouseY: number,
  componentWidth: number,
  componentHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  existingComponents: Array<{ position: { x: number; y: number }; size: { width: number; height: number } }>
): { x: number; y: number; guides: { vertical?: number; horizontal?: number } } {
  const snappedX = snapToGrid(mouseX);
  const snappedY = snapToGrid(mouseY);

  let finalX = snappedX;
  let finalY = snappedY;
  let guides: { vertical?: number; horizontal?: number } = {};

  const SNAP_THRESHOLD = GRID_SIZE / 2;

  // Check for snapping to other components
  for (const component of existingComponents) {
    const componentRight = component.position.x + component.size.width;
    const componentBottom = component.position.y + component.size.height;

    // Snap to left edge
    if (Math.abs(snappedX - component.position.x) < SNAP_THRESHOLD) {
      finalX = component.position.x;
      guides.vertical = component.position.x;
    }
    // Snap to right edge
    else if (Math.abs(snappedX - componentRight) < SNAP_THRESHOLD) {
      finalX = componentRight;
      guides.vertical = componentRight;
    }
    // Snap to center
    else if (Math.abs(snappedX + componentWidth / 2 - (component.position.x + component.size.width / 2)) < SNAP_THRESHOLD) {
      finalX = component.position.x + component.size.width / 2 - componentWidth / 2;
      guides.vertical = component.position.x + component.size.width / 2;
    }

    // Snap to top edge
    if (Math.abs(snappedY - component.position.y) < SNAP_THRESHOLD) {
      finalY = component.position.y;
      guides.horizontal = component.position.y;
    }
    // Snap to bottom edge
    else if (Math.abs(snappedY - componentBottom) < SNAP_THRESHOLD) {
      finalY = componentBottom;
      guides.horizontal = componentBottom;
    }
    // Snap to center
    else if (Math.abs(snappedY + componentHeight / 2 - (component.position.y + component.size.height / 2)) < SNAP_THRESHOLD) {
      finalY = component.position.y + component.size.height / 2 - componentHeight / 2;
      guides.horizontal = component.position.y + component.size.height / 2;
    }
  }

  // Ensure component stays within canvas bounds
  finalX = Math.max(0, Math.min(finalX, canvasWidth - componentWidth));
  finalY = Math.max(0, finalY);

  return { x: finalX, y: finalY, guides };
}