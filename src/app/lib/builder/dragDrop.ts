import { VIEWPORT_SIZES, GRID_SIZE } from "../../../config/builder";
import { Viewport } from "../../types/builder";

export function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function clampDropPosition(
  x: number,
  y: number,
  viewport: Viewport,
  padding = 100,
) {
  const bounds = VIEWPORT_SIZES[viewport];

  return {
    x: Math.max(0, Math.min(x, bounds.width - padding)),
    y: Math.max(0, y),
  };
}