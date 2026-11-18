import type { Metadata } from "next";
import { packNames } from "../icons/packs.generated";
import { SiteHeader, REPO_URL } from "../components/site-header";

export const metadata: Metadata = { title: "Docs · Davi Icons" };

const INSTALL = `npm install davi-icons
# or
pnpm add davi-icons
# or
yarn add davi-icons`;

const ROOT_IMPORT = `import { Bi5Circle, DvFrogArtist } from "davi-icons";

export function Example() {
  return (
    <div>
      <DvFrogArtist size={32} />
      <Bi5Circle size={24} color="#3d62ff" />
    </div>
  );
}`;

const SUBPATH_IMPORT = `import { Bi5Circle } from "davi-icons/bi";
import { DvFrogArtist } from "davi-icons/dv";`;

const PROPS = `<DvZaloOutline
  size={24}            // number or CSS length, defaults to 1em
  color="#2962ff"      // sets currentColor
  className="icon"
  style={{ verticalAlign: "middle" }}
  title="Zalo"         // accessible name; omitted = aria-hidden
  strokeWidth={1.5}    // any other SVG attribute is passed through
/>`;

export default function DocsPage() {
  const packs = Object.entries(packNames).sort((a, b) => a[1].localeCompare(b[1]));
  return (
    <main className="page">
      <SiteHeader />
      <article className="prose">
        <h1>Docs</h1>

        <h2>Install</h2>
        <pre>{INSTALL}</pre>

        <h2>Import</h2>
        <p>
          Import icons by component name from the package root. Every icon is a standalone ESM export, so bundlers keep
          only the icons you use.
        </p>
        <pre>{ROOT_IMPORT}</pre>

        <h3>Subpath import</h3>
        <p>Import from a single pack for faster builds and lighter autocomplete.</p>
        <pre>{SUBPATH_IMPORT}</pre>

        <h2>Props</h2>
        <pre>{PROPS}</pre>

        <h2>Finding icon names</h2>
        <p>
          Search on the <a href="/">Icons</a> page and click an icon to copy its import line. Component names are the pack
          prefix plus the icon name in PascalCase, for example <code>dv</code> + <code>zalo-outline</code> →{" "}
          <code>DvZaloOutline</code>.
        </p>

        <h2>Icon packs</h2>
        <table>
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Pack</th>
            </tr>
          </thead>
          <tbody>
            {packs.map(([id, name]) => (
              <tr key={id}>
                <td>
                  <code>{id}</code>
                </td>
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Each pack keeps its original license. Source and issues on{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </article>
    </main>
  );
}
