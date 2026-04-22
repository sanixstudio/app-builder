export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}
