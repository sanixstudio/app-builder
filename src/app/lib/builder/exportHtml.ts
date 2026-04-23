import { ComponentInstance } from "../../types/builder";

export function generateHTML(components: ComponentInstance[], pageTitle: string): string {
  const componentHTML = components
    .map((comp) => {
      const { type, props, position, size } = comp;
      const style = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;`;

      switch (type) {
        case "heading1":
        case "heading2":
        case "heading3":
          return `<${props.level} style="${style} text-align: ${props.align}; color: ${props.color};">${props.text}</${props.level}>`;

        case "paragraph":
          return `<p style="${style} text-align: ${props.align}; color: ${props.color};">${props.text}</p>`;

        case "link":
          return `<a href="${props.url}" style="${style} color: ${props.color}; text-decoration: ${props.underline ? "underline" : "none"};">${props.text}</a>`;

        case "button":
          return `<a href="${props.url}" style="${style} display: flex; align-items: center; justify-content: center; background-color: #2563eb; color: white; border-radius: 0.5rem; text-decoration: none;">${props.text}</a>`;

        case "image":
          return `<img src="${props.src}" alt="${props.alt}" style="${style} object-fit: cover; ${props.rounded ? "border-radius: 0.5rem;" : ""}" />`;

        case "section":
          return `<section style="${style} background-color: ${props.bgColor}; padding: ${props.padding}px;"><!-- Section content --></section>`;

        default:
          return `<!-- ${type} component -->`;
      }
    })
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; position: relative; min-height: 2000px; }
  </style>
</head>
<body>
  <main>
    ${componentHTML}
  </main>
</body>
</html>`;
}