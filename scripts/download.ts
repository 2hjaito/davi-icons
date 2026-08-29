import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { PackManifest } from "../iconpacks/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const repoRoot = path.resolve(__dirname, "..");

export async function downloadAndExtract(pack: PackManifest): Promise<string> {
  if (pack.local) {
    return repoRoot;
  }

  if (!pack.downloadURL) {
    throw new Error(`Pack ${pack.id} is remote but missing downloadURL`);
  }

  const downloadsDir = path.join(repoRoot, ".cache", "downloads");
  const extractedDir = path.join(repoRoot, ".cache", "extracted", pack.id);
  const archiveName = pack.downloadFileName ?? `${pack.id}.tar.gz`;
  const archivePath = path.join(downloadsDir, archiveName);

  fs.mkdirSync(downloadsDir, { recursive: true });
  fs.mkdirSync(extractedDir, { recursive: true });

  if (!fs.existsSync(archivePath) || fs.statSync(archivePath).size === 0) {
    console.log(`Downloading ${pack.name} archive from ${pack.downloadURL}...`);
    const response = await fetch(pack.downloadURL);
    if (!response.ok) {
      throw new Error(`Failed to download ${pack.id}: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(archivePath, Buffer.from(buffer));
  }

  if (fs.readdirSync(extractedDir).length === 0) {
    console.log(`Extracting ${pack.name} into .cache/extracted/${pack.id}...`);
    execSync(`tar -xzf "${archivePath}" -C "${extractedDir}" --strip-components=1`);
  }

  return extractedDir;
}
