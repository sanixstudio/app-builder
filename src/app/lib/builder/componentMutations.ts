import { ComponentInstance, ComponentProps } from "../../types/builder";

export function deleteComponent(
  components: ComponentInstance[],
  id: string,
) {
  return components.filter((component) => component.id !== id);
}

export function updateComponentProps(
  components: ComponentInstance[],
  id: string,
  newProps: ComponentProps,
) {
  return components.map((component) =>
    component.id === id
      ? { ...component, props: newProps }
      : component,
  );
}

export function moveComponent(
  components: ComponentInstance[],
  id: string,
  x: number,
  y: number,
) {
  return components.map((component) =>
    component.id === id
      ? { ...component, position: { x, y } }
      : component,
  );
}

export function resizeComponent(
  components: ComponentInstance[],
  id: string,
  width: number,
  height: number,
) {
  return components.map((component) =>
    component.id === id
      ? { ...component, size: { width, height } }
      : component,
  );
}