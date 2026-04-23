import { DEFAULT_COMPONENT_SIZE, FALLBACK_COMPONENT_SIZE } from "../../../config/builder";
import { ComponentInstance, ComponentProps } from "../../types/builder";

export function getDefaultSize(type: string) {
  return (
    DEFAULT_COMPONENT_SIZE[type as keyof typeof DEFAULT_COMPONENT_SIZE] ??
    FALLBACK_COMPONENT_SIZE
  );
}

export function createComponentInstance(params: {
  type: string;
  defaultProps: ComponentProps;
  x: number;
  y: number;
}): ComponentInstance {
  return {
    id: `${params.type}-${Date.now()}`,
    type: params.type,
    props: params.defaultProps,
    position: { x: params.x, y: params.y },
    size: getDefaultSize(params.type),
  };
}