import { optimize } from "svgo";
import { parse, type Element, type Node } from "svg-parser";

export type DaviIconNode = [
  tag: string,
  attributes: Record<string, string | number | boolean>,
  children?: DaviIconNode[]
];

export interface ProcessedSvg {
  viewBox: string;
  nodes: DaviIconNode[];
}

function normalizePathData(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}

function isInvisibleFill(attributes: Record<string, string | number | boolean>): boolean {
  return String(attributes.fill ?? "").toLowerCase() === "none";
}

function isFullViewBoxBackground(node: DaviIconNode, viewBox: string): boolean {
  const [tag, attributes] = node;
  if (isInvisibleFill(attributes)) return false;

  const [, , width, height] = viewBox.split(" ").map(Number);
  if (tag === "rect") {
    const x = Number(attributes.x ?? 0);
    const y = Number(attributes.y ?? 0);
    return x === 0 && y === 0 && Number(attributes.width) === width && Number(attributes.height) === height;
  }

  if (tag !== "path" || typeof attributes.d !== "string") return false;

  return normalizePathData(attributes.d) === normalizePathData(`M0 0h${width}v${height}H0z`);
}

function removeLeadingBackground(nodes: DaviIconNode[], viewBox: string): DaviIconNode[] {
  if (nodes.length < 2 || !isFullViewBoxBackground(nodes[0], viewBox)) return nodes;
  return nodes.slice(1);
}

function ensureValidViewBox(viewBox: string): string {
  if (!viewBox || !viewBox.trim()) {
    throw new Error("ViewBox is required");
  }

  const parts = viewBox.trim().split(/\s+/);
  if (parts.length !== 4) {
    throw new Error(`Invalid viewBox: ${viewBox}`);
  }

  const [minX, minY, width, height] = parts.map(Number);
  if (![minX, minY, width, height].every((value) => Number.isFinite(value))) {
    throw new Error(`Invalid viewBox numeric values: ${viewBox}`);
  }

  return `${minX} ${minY} ${width} ${height}`;
}

function convertElement(node: Node): DaviIconNode | null {
  if (node.type !== "element") return null;
  const element = node as Element;
  const tag = element.tagName;
  if (!tag) return null;

  const lowerTag = tag.toLowerCase();
  if (lowerTag === "style" || lowerTag === "script" || lowerTag === "title" || lowerTag === "desc") {
    return null;
  }

  const attributes: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(element.properties ?? {})) {
    if (val === undefined || val === null) continue;
    if (typeof val === "boolean" || typeof val === "number" || typeof val === "string") {
      attributes[key] = val;
    } else {
      attributes[key] = String(val);
    }
  }

  const children: DaviIconNode[] = [];
  for (const child of element.children ?? []) {
    if (typeof child === "object") {
      const converted = convertElement(child);
      if (converted) children.push(converted);
    }
  }

  if (children.length > 0) {
    return [tag, attributes, children];
  }
  return [tag, attributes];
}

const INHERITABLE_ROOT_ATTRS = new Set([
  "fill",
  "fill-rule",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "opacity",
  "color",
  "clip-rule",
]);

export function processSvgContent(rawSvg: string, filePath?: string, idPrefix?: string): ProcessedSvg {
  const safePrefix = idPrefix ? idPrefix.replace(/[^a-zA-Z0-9_-]/g, "_") : undefined;
  const plugins: any[] = [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
          inlineStyles: {
            onlyMatchedOnce: false,
          },
        },
      },
    },
  ];

  if (safePrefix) {
    plugins.push({
      name: "prefixIds",
      params: {
        prefix: safePrefix,
        delim: "_",
      },
    });
  }

  const optimized = optimize(rawSvg, {
    path: filePath,
    multipass: true,
    plugins,
  }).data;

  const ast = parse(optimized);
  const svgElement = ast.children.find(
    (child): child is Element => typeof child === "object" && child.type === "element" && child.tagName?.toLowerCase() === "svg"
  );

  if (!svgElement) {
    throw new Error(`Invalid SVG file (no <svg> root found)${filePath ? `: ${filePath}` : ""}`);
  }

  const props = svgElement.properties ?? {};
  let viewBox = (props.viewBox ?? props.viewbox ?? "") as string;

  if (!viewBox && props.width && props.height) {
    viewBox = `0 0 ${props.width} ${props.height}`;
  }
  if (!viewBox) {
    viewBox = "0 0 24 24";
  }

  const validViewBox = ensureValidViewBox(viewBox);

  const nodes: DaviIconNode[] = [];
  for (const child of svgElement.children ?? []) {
    if (typeof child === "object") {
      const converted = convertElement(child);
      if (converted) nodes.push(converted);
    }
  }

  // Presentation attributes on <svg> are inherited by children, so keep them on a wrapper group.
  const rootAttributes: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!INHERITABLE_ROOT_ATTRS.has(key)) continue;
    if (value === undefined || value === null) continue;
    rootAttributes[key] = value as string | number | boolean;
  }

  return {
    viewBox: validViewBox,
    nodes: Object.keys(rootAttributes).length > 0 ? [["g", rootAttributes, removeLeadingBackground(nodes, validViewBox)]] : removeLeadingBackground(nodes, validViewBox),
  };
}
