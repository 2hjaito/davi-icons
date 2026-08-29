import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { manifests } from "../iconpacks/index.js";
import { downloadAndExtract, repoRoot } from "./download.js";
import { generatePackModule, generatePackageIndex } from "./templates.js";
import { processSvgContent } from "./svg.js";

type DaviIconDefinition = {
  name: string;
  componentName: string;
  pack: string;
  width: number;
  height: number;
  viewBox: string;
  nodes: any[];
  source?: { project: string };
};

export async function buildAllPacks(): Promise<Record<string, number>> {
  const packageDir = path.join(repoRoot, "package");
  const generatedDir = path.join(packageDir, "icons");
  fs.mkdirSync(generatedDir, { recursive: true });

  const selected = manifests;
  const output: Record<string, number> = {};
  const exportNames: string[] = [];
  const allMetadata: Array<{ pack: string; name: string; componentName: string }> = [];

  for (const pack of selected) {
    console.log(`Processing ${pack.name} (${pack.id})...`);
    const packRoot = await downloadAndExtract(pack);
    const packIcons: DaviIconDefinition[] = [];
    const seen = new Set<string>();

    for (const content of pack.contents) {
      const matches = fg.sync(content.files, { cwd: packRoot, dot: true, onlyFiles: true });
      if (matches.length === 0) {
        throw new Error(`Pack ${pack.id} returned 0 matches for ${content.files}`);
      }

      for (const match of matches) {
        const fullPath = path.join(packRoot, match);
        const rawName = content.nameFromPath ? content.nameFromPath(match) : path.basename(match, ".svg");
        const componentName = content.formatter(rawName);
        if (seen.has(componentName)) continue;
        seen.add(componentName);

        const rawSvg = fs.readFileSync(fullPath, "utf8");
        const { viewBox, nodes } = processSvgContent(rawSvg, fullPath, `${pack.id}_${rawName}`);

        packIcons.push({
          name: rawName,
          componentName,
          pack: pack.id,
          width: 24,
          height: 24,
          viewBox,
          nodes,
          source: { project: pack.id },
        });

        allMetadata.push({
          pack: pack.id,
          name: rawName,
          componentName,
        });
      }
    }

    if (packIcons.length === 0) {
      throw new Error(`No icons generated for pack ${pack.id}`);
    }

    fs.writeFileSync(path.join(generatedDir, `${pack.id}.ts`), generatePackModule(packIcons), "utf8");
    exportNames.push(pack.id);
    output[pack.id] = packIcons.length;
    console.log(`  -> Generated ${packIcons.length} icons for ${pack.id}`);
  }

  const packageIndex = path.join(repoRoot, "package", "src", "index.tsx");
  fs.writeFileSync(packageIndex, generatePackageIndex(exportNames), "utf8");

  // Keep package subpath exports in sync with the generated packs.
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const exportsMap: Record<string, unknown> = {
    ".": packageJson.exports?.["."],
    "./metadata": { import: "./dist/icons/metadata.json" },
  };
  for (const id of exportNames) {
    exportsMap[`./${id}`] = {
      types: `./dist/icons/${id}.d.ts`,
      import: `./dist/icons/${id}.js`,
    };
  }
  packageJson.exports = exportsMap;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

  // Generate metadata.json for web app
  const metadataPath = path.join(generatedDir, "metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(allMetadata, null, 2), "utf8");

  // Copy metadata.json to web public directory for runtime access
  const webPublicDir = path.join(repoRoot, "apps", "web", "public");
  fs.mkdirSync(webPublicDir, { recursive: true });
  fs.copyFileSync(metadataPath, path.join(webPublicDir, "metadata.json"));

  // Lazy pack loaders so the browser only downloads the packs it renders.
  const loaderLines = [
    "// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.",
    'import type { ComponentType } from "react";',
    "",
    "export type IconComponent = ComponentType<{ size?: number }>;",
    "",
    "export const packLoaders: Record<string, () => Promise<Record<string, IconComponent>>> = {",
    ...exportNames.map(
      (id) => `  ${id}: () => import("@davi-icons/icons/${id}") as unknown as Promise<Record<string, IconComponent>>,`
    ),
    "};",
    "",
    "export const packNames: Record<string, string> = {",
    ...selected.map((pack) => `  ${pack.id}: ${JSON.stringify(pack.name)},`),
    "};",
    "",
  ];
  fs.writeFileSync(path.join(repoRoot, "apps", "web", "app", "icons", "packs.generated.ts"), loaderLines.join("\n"), "utf8");

  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildAllPacks().then((counts) => {
    console.log("\nSync Summary:");
    let total = 0;
    for (const [pack, count] of Object.entries(counts)) {
      console.log(`- ${pack}: ${count} icons`);
      total += count;
    }
    console.log(`Total: ${total} icons\n`);
  }).catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
}
