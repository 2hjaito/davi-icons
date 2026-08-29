export interface DaviIconDefinition {
  name: string;
  componentName: string;
  pack: string;
  width: number;
  height: number;
  viewBox: string;
  nodes: any[];
  source?: { project: string };
}

export function generatePackModule(icons: DaviIconDefinition[]): string {
  const lines = [
    "/**",
    " * AUTO-GENERATED FILE.",
    " * DO NOT EDIT MANUALLY.",
    " */",
    "import { createDaviIcon, type DaviIconDefinition } from \"../src/index.js\";",
    "",
  ];

  for (const icon of icons) {
    lines.push(`export const ${icon.componentName} = createDaviIcon(${JSON.stringify(icon, null, 2)} as DaviIconDefinition);`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

export function generatePackageIndex(packIds: string[]): string {
  const lines = [
    'import React from "react";',
    "",
    "export type DaviIconNode = [",
    "  tag: string,",
    "  attributes: Record<string, string | number | boolean>,",
    "  children?: DaviIconNode[]",
    "];",
    "",
    "export interface DaviIconSource {",
    "  project: string;",
    "  url?: string;",
    "}",
    "",
    "export interface DaviIconDefinition {",
    "  name: string;",
    "  componentName: string;",
    "  pack: string;",
    "  width: number;",
    "  height: number;",
    "  viewBox: string;",
    "  nodes: DaviIconNode[];",
    "  scale?: number;",
    "  multiColor?: boolean;",
    "  source?: DaviIconSource;",
    "}",
    "",
    'export interface DaviIconProps extends Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> {',
    "  icon?: DaviIconDefinition;",
    "  size?: number | string;",
    "  width?: number | string;",
    "  height?: number | string;",
    "  title?: string;",
    "}",
    "",
    "function toCamelCase(value: string): string {",
    "  return value.replace(/-([a-z])/g, (_match, char: string) => char.toUpperCase());",
    "}",
    "",
    "function parseStyle(value: string): Record<string, string> {",
    "  const style: Record<string, string> = {};",
    "  for (const declaration of value.split(\";\")) {",
    "    const separator = declaration.indexOf(\":\");",
    "    if (separator === -1) continue;",
    "    const property = declaration.slice(0, separator).trim();",
    "    const propertyValue = declaration.slice(separator + 1).trim();",
    "    if (!property || !propertyValue) continue;",
    "    style[property.startsWith(\"--\") ? property : toCamelCase(property)] = propertyValue;",
    "  }",
    "  return style;",
    "}",
    "",
    "function renderNode(node: DaviIconNode): React.ReactNode {",
    "  const [tag, attributes, children] = node;",
    "  const props: Record<string, unknown> = {};",
    "  for (const [key, value] of Object.entries(attributes ?? {})) {",
    "    if (value === undefined || value === null) continue;",
    "    if (key === \"style\") {",
    "      props.style = typeof value === \"string\" ? parseStyle(value) : value;",
    "      continue;",
    "    }",
    "    if (key === \"class\") {",
    "      props.className = value;",
    "      continue;",
    "    }",
    "    const isNamespaced = key.startsWith(\"data-\") || key.startsWith(\"aria-\") || key.includes(\":\");",
    "    props[isNamespaced ? key : toCamelCase(key)] = value;",
    "  }",
    "  const childNodes = (children ?? []).map((child: DaviIconNode) => renderNode(child));",
    "  return React.createElement(tag, props, ...childNodes);",
    "}",
    "",
    "export function DaviIcon({ icon, size, width, height, title, ...rest }: DaviIconProps) {",
    "  if (!icon) return null;",
    "  const computedWidth = width ?? size ?? icon.width ?? 24;",
    "  const computedHeight = height ?? size ?? icon.height ?? 24;",
    "  const ariaHidden = title ? undefined : true;",
    "  return (",
    "    <svg",
    "      viewBox={icon.viewBox}",
    "      width={computedWidth}",
    "      height={computedHeight}",
    '      fill="currentColor"',
    "      aria-hidden={ariaHidden}",
    '      role={title ? "img" : undefined}',
    "      {...rest}",
    "    >",
    "      {title ? <title>{title}</title> : null}",
    "      {icon.nodes.map((node: DaviIconNode, index: number) => (",
    '        <React.Fragment key={`${icon.name}-${index}`}>{renderNode(node)}</React.Fragment>',
    "      ))}",
    "    </svg>",
    "  );",
    "}",
    "",
    "export function createDaviIcon(iconData: DaviIconDefinition) {",
    "  return (props: DaviIconProps) => React.createElement(DaviIcon, { ...props, icon: iconData });",
    "}",
    "",
  ];

  for (const id of packIds) {
    lines.push(`export * from "../icons/${id}.js";`);
  }

  return `${lines.join("\n")}\n`;
}
