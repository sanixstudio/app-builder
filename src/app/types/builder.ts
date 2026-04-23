export type Viewport = "desktop" | "mobile";

export type BuilderComponentType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "link"
  | "section"
  | "container"
  | "columns"
  | "grid"
  | "spacer"
  | "button"
  | "image"
  | "video"
  | "icon"
  | "divider"
  | "input"
  | "textarea"
  | "checkbox"
  | "form"
  | "hero"
  | "feature"
  | "testimonial"
  | "cta"
  | "pricing"
  | "navbar"
  | "footer"
  | "team";

export type ComponentPosition = {
  x: number;
  y: number;
};

export type ComponentSize = {
  width: number;
  height: number;
};

export type ComponentProps = Record<string, unknown>;

export type ComponentInstance = {
  id: string;
  type: BuilderComponentType | string;
  props: ComponentProps;
  position: ComponentPosition;
  size: ComponentSize;
};

export type DraggedComponent = {
  type: BuilderComponentType | string;
  defaultProps: ComponentProps;
};