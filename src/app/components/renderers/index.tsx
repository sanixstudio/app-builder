import { ComponentProps } from "../../types/builder";
import * as Renderers from "./ComponentRenderers";

export type ComponentRendererProps = {
  props: ComponentProps;
};

export const componentRendererMap: Record<string, React.ComponentType<ComponentRendererProps>> = {
  heading1: Renderers.HeadingRenderer,
  heading2: Renderers.HeadingRenderer,
  heading3: Renderers.HeadingRenderer,
  paragraph: Renderers.ParagraphRenderer,
  link: Renderers.LinkRenderer,
  section: Renderers.SectionRenderer,
  container: Renderers.ContainerRenderer,
  columns: Renderers.ColumnsRenderer,
  grid: Renderers.GridRenderer,
  spacer: Renderers.SpacerRenderer,
  button: Renderers.ButtonRenderer,
  image: Renderers.ImageRenderer,
  video: Renderers.VideoRenderer,
  icon: Renderers.IconRenderer,
  divider: Renderers.DividerRenderer,
  input: Renderers.InputRenderer,
  textarea: Renderers.TextareaRenderer,
  checkbox: Renderers.CheckboxRenderer,
  form: Renderers.FormRenderer,
  hero: Renderers.HeroRenderer,
  feature: Renderers.FeatureRenderer,
  testimonial: Renderers.TestimonialRenderer,
  cta: Renderers.CTARenderer,
  pricing: Renderers.PricingRenderer,
  navbar: Renderers.NavbarRenderer,
  footer: Renderers.FooterRenderer,
  team: Renderers.TeamRenderer,
};

export function renderComponent(type: string, props: ComponentProps) {
  const Renderer = componentRendererMap[type];
  if (!Renderer) {
    return <div className="text-red-500">Unknown component: {type}</div>;
  }
  return <Renderer props={props} />;
}