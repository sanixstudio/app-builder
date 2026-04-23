import { Viewport } from "../app/types/builder";

export const DEFAULT_COMPONENT_SIZE = {
  heading1: { width: 400, height: 80 },
  heading2: { width: 400, height: 60 },
  heading3: { width: 400, height: 60 },
  paragraph: { width: 400, height: 120 },
  link: { width: 200, height: 40 },
  section: { width: 800, height: 400 },
  container: { width: 600, height: 300 },
  columns: { width: 800, height: 300 },
  grid: { width: 600, height: 400 },
  spacer: { width: 400, height: 60 },
  button: { width: 200, height: 60 },
  image: { width: 400, height: 300 },
  video: { width: 560, height: 315 },
  icon: { width: 100, height: 100 },
  divider: { width: 600, height: 40 },
  input: { width: 400, height: 100 },
  textarea: { width: 400, height: 180 },
  checkbox: { width: 400, height: 40 },
  form: { width: 500, height: 400 },
  hero: { width: 1000, height: 500 },
  feature: { width: 350, height: 300 },
  testimonial: { width: 400, height: 250 },
  cta: { width: 800, height: 400 },
  pricing: { width: 350, height: 600 },
  navbar: { width: 1200, height: 80 },
  footer: { width: 1200, height: 120 },
  team: { width: 300, height: 300 },
} as const;

export const GRID_SIZE = 20;

export const FALLBACK_COMPONENT_SIZE = { width: 400, height: 200 };

export const VIEWPORT_SIZES: Record<
  Viewport,
  { width: number; height: number }
> = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
