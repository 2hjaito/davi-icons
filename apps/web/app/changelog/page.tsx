import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { SiteHeader, REPO_URL } from "../components/site-header";

export const metadata: Metadata = { title: "Changelog · Davi Icons" };

type Release = { title: string; items: string[] };

// CHANGELOG.md at the repo root is the single source; this page renders it at build time.
function readChangelog(): Release[] {
  const file = path.join(process.cwd(), "../../CHANGELOG.md");
  const releases: Release[] = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (line.startsWith("## ")) releases.push({ title: line.slice(3).trim(), items: [] });
    else if (line.startsWith("- ") && releases.length > 0) releases[releases.length - 1].items.push(line.slice(2).trim());
  }
  return releases;
}

// Render `code` spans from the markdown bullets; everything else is plain text.
function inline(text: string) {
  return text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part));
}

export default function ChangelogPage() {
  const releases = readChangelog();
  return (
    <main className="page">
      <SiteHeader />
      <article className="prose">
        <h1>Changelog</h1>
        <p>
          Release notes for the <code>davi-icons</code> package. Full history on{" "}
          <a href={`${REPO_URL}/commits`} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
        {releases.map((release) => (
          <section key={release.title}>
            <h2>{release.title}</h2>
            <ul>
              {release.items.map((item) => (
                <li key={item}>{inline(item)}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </main>
  );
}
