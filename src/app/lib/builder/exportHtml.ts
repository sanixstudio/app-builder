import { ComponentInstance } from "../../types/builder";

function escapeHtml(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toStyle(styles: Record<string, string | number>) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}

function iconEmoji(iconType: string | undefined) {
  const map: Record<string, string> = {
    star: "⭐",
    zap: "⚡",
    award: "🏆",
    heart: "❤️",
    trending: "📈",
    shield: "🛡️",
  };
  return map[iconType ?? ""] || "⭐";
}

export function generateHTML(
  components: ComponentInstance[],
  pageTitle: string = "Landing Page"
): string {
  const pageHeight = Math.max(
    800,
    components.reduce(
      (max, component) =>
        Math.max(max, component.position.y + component.size.height + 80),
      0
    )
  );

  const componentHTML = components
    .map((comp) => {
      const { type, props, position, size } = comp;
      const baseStyle = toStyle({
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      });

      const safe = (value: unknown) => escapeHtml(value);
      const features = Array.isArray(props.features) ? props.features : [];
      const links = Array.isArray(props.links) ? props.links : [];

      switch (type) {
        case "heading1":
        case "heading2":
        case "heading3":
          return `<${safe(props.level)} style="${baseStyle} text-align: ${safe(props.align)}; color: ${safe(props.color)};">${safe(props.text)}</${safe(props.level)}>`;

        case "paragraph":
          return `<p style="${baseStyle} text-align: ${safe(props.align)}; color: ${safe(props.color)};">${safe(props.text)}</p>`;

        case "link":
          return `<a href="${safe(props.url)}" style="${baseStyle} color: ${safe(props.color)}; text-decoration: ${props.underline ? "underline" : "none"};">${safe(props.text)}</a>`;

        case "button":
          return `<a href="${safe(props.url)}" style="${baseStyle} display: inline-flex; align-items: center; justify-content: center; background-color: #2563eb; color: white; border-radius: 0.5rem; text-decoration: none;">${safe(props.text)}</a>`;

        case "image":
          return `<img src="${safe(props.src)}" alt="${safe(props.alt)}" style="${baseStyle} object-fit: cover; ${props.rounded ? "border-radius: 0.75rem;" : ""}" />`;

        case "section":
          return `<section style="${baseStyle} background-color: ${safe(props.bgColor)}; padding: ${safe(props.padding)}px;">Section container</section>`;

        case "container":
          return `<div style="${baseStyle} background-color: ${safe(props.bgColor)}; padding: ${safe(props.padding)}px;">Container</div>`;

        case "columns":
          return `<div style="${baseStyle} display: grid; grid-template-columns: repeat(${safe(props.columns)}, minmax(0, 1fr)); gap: ${safe(props.gap)}px; background-color: ${safe(props.bgColor)};">${Array.from({ length: Number(props.columns) || 2 })
            .map((_, index) => `<div style="background: rgba(229, 231, 235, 0.8); border: 1px dashed #d1d5db; padding: 1rem;">Column ${index + 1}</div>`)
            .join("")}</div>`;

        case "grid":
          return `<div style="${baseStyle} display: grid; grid-template-columns: repeat(${safe(props.columns)}, minmax(0, 1fr)); gap: ${safe(props.gap)}px; background-color: ${safe(props.bgColor)};">${Array.from({ length: (Number(props.columns) || 3) * 2 })
            .map((_, index) => `<div style="background: rgba(229, 231, 235, 0.8); border: 1px dashed #d1d5db; padding: 1rem;">Item ${index + 1}</div>`)
            .join("")}</div>`;

        case "spacer":
          return `<div style="${baseStyle}"></div>`;

        case "icon":
          return `<div style="${baseStyle} display: flex; align-items: center; justify-content: center; font-size: 2rem;">${iconEmoji(props.iconType as string)}</div>`;

        case "divider":
          return `<hr style="${baseStyle} border: none; border-bottom: ${safe(props.thickness)}px solid ${safe(props.color)}; margin: 0;" />`;

        case "input":
          return `<div style="${baseStyle} display:flex; flex-direction:column; gap:0.5rem;"><label style="font-size:0.85rem; color:#374151;">${safe(props.label)}${props.required ? " *" : ""}</label><input type="${safe(props.type)}" placeholder="${safe(props.placeholder)}" style="width:100%; padding:0.75rem; border:1px solid #d1d5db; border-radius:0.5rem;" /></div>`;

        case "textarea":
          return `<div style="${baseStyle} display:flex; flex-direction:column; gap:0.5rem;"><label style="font-size:0.85rem; color:#374151;">${safe(props.label)}</label><textarea rows="${safe(props.rows)}" placeholder="${safe(props.placeholder)}" style="width:100%; padding:0.75rem; border:1px solid #d1d5db; border-radius:0.5rem;"></textarea></div>`;

        case "checkbox":
          return `<label style="${baseStyle} display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" style="width:1rem; height:1rem;" /><span>${safe(props.label)}</span></label>`;

        case "form":
          return `<form action="${safe(props.action)}" style="${baseStyle} padding:1.5rem; border:1px solid #e5e7eb; border-radius:0.75rem; background:#f9fafb;"><div style="margin-bottom:1rem; color:#6b7280;">Form container</div><button type="submit" style="width:100%; padding:0.75rem; border:none; border-radius:0.75rem; background:#2563eb; color:white;">${safe(props.submitText)}</button></form>`;

        case "hero":
          return `<section style="${baseStyle} background-color: ${safe(props.bgColor)}; color: white; padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-radius: 1rem;"><h1 style="font-size:2rem; margin-bottom:0.75rem;">${safe(props.title)}</h1><p style="font-size:1rem; margin-bottom:1.25rem; opacity:0.9;">${safe(props.subtitle)}</p><a href="#" style="padding:0.9rem 1.5rem; border-radius:0.75rem; background:white; color:#111827; text-decoration:none; font-weight:600;">${safe(props.ctaText)}</a></section>`;

        case "feature":
          return `<div style="${baseStyle} background:white; border:1px solid #e5e7eb; border-radius:1rem; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;"><div style="font-size:1.5rem;">${iconEmoji(props.icon as string)}</div><div><h3 style="margin:0.75rem 0 0.5rem 0;">${safe(props.title)}</h3><p style="margin:0; color:#4b5563;">${safe(props.description)}</p></div></div>`;

        case "testimonial":
          return `<div style="${baseStyle} background:white; border:1px solid #e5e7eb; border-radius:1rem; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;"><p style="margin:0 0 1rem 0; font-style:italic; color:#374151;">\"${safe(props.quote)}\"</p><div><p style="margin:0; font-weight:700;">${safe(props.author)}</p><p style="margin:0; color:#6b7280; font-size:0.9rem;">${safe(props.role)}</p></div></div>`;

        case "cta":
          return `<section style="${baseStyle} background-color: ${safe(props.bgColor)}; color: white; padding: 2rem; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; border-radius:1rem;"><h2 style="margin:0 0 0.75rem 0;">${safe(props.title)}</h2><p style="margin:0 0 1rem 0; opacity:0.95;">${safe(props.description)}</p><button style="padding:0.9rem 1.5rem; border:none; border-radius:0.75rem; background:white; color:#7c3aed; font-weight:700;">${safe(props.buttonText)}</button></section>`;

        case "pricing":
          return `<div style="${baseStyle} background:white; border:1px solid #e5e7eb; border-radius:1rem; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;"><div><h3 style="margin:0 0 0.5rem 0;">${safe(props.title)}</h3><div style="font-size:2rem; font-weight:700; margin-bottom:0.75rem;">${safe(props.price)} <span style="font-size:1rem; color:#6b7280;">${safe(props.period)}</span></div><ul style="padding-left:1.25rem; color:#374151; margin:0 0 1rem 0;">${features.map((feature) => `<li>${safe(feature)}</li>`).join("")}</ul></div><button style="padding:0.9rem 1.5rem; border:none; border-radius:0.75rem; background:#2563eb; color:white;">Get started</button></div>`;

        case "navbar":
          return `<nav style="${baseStyle} background:white; display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border-bottom:1px solid #e5e7eb;"><div style="font-weight:700;">${safe(props.logo)}</div><div style="display:flex; gap:1rem;">${links.map((link) => `<a href="#" style="color:#374151; text-decoration:none;">${safe(link)}</a>`).join("")}</div></nav>`;

        case "footer":
          return `<footer style="${baseStyle} background:#111827; color:white; padding:1.5rem; display:flex; align-items:center; justify-content:space-between; border-radius:1rem;"><div>${safe(props.copyright)}</div><div style="display:flex; gap:1rem;">${links.map((link) => `<a href="#" style="color:#d1d5db; text-decoration:none;">${safe(link)}</a>`).join("")}</div></footer>`;

        case "team":
          return `<div style="${baseStyle} background:white; border:1px solid #e5e7eb; border-radius:1rem; padding:1.25rem; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center;"><img src="${safe(props.image)}" alt="${safe(props.name)}" style="width:8rem; height:8rem; object-fit:cover; border-radius:9999px; margin-bottom:1rem;" /><h3 style="margin:0.25rem 0 0.5rem 0;">${safe(props.name)}</h3><p style="margin:0; color:#6b7280;">${safe(props.role)}</p></div>`;

        default:
          return `<div style="${baseStyle} display:flex; align-items:center; justify-content:center; border:1px dashed #d1d5db; color:#6b7280;">${safe(type)}</div>`;
      }
    })
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #111827; }
    a { color: inherit; }
    input, textarea, button { font: inherit; }
    .page-wrapper { width: 100%; max-width: 1440px; margin: 0 auto; background: #ffffff; position: relative; min-height: ${pageHeight}px; }
    @media (max-width: 768px) {
      .page-wrapper { padding: 1rem; }
      .responsive-component { width: 100% !important; left: 0 !important; right: auto !important; }
    }
  </style>
</head>
<body>
  <main class="page-wrapper">
    ${componentHTML}
  </main>
</body>
</html>`;
}
