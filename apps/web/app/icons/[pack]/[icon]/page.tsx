"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type ComponentType } from "react";
import { packLoaders } from "../../packs.generated";
import { SiteHeader } from "../../../components/site-header";

type IconMetadata = {
  pack: string;
  name: string;
  componentName: string;
};

type IconComponent = ComponentType<{ size?: number }> & { name?: string };

function IconPreview({ pack, iconName, metadata }: { pack: string; iconName: string; metadata: IconMetadata[] }) {
  const [IconComponent, setIconComponent] = useState<IconComponent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const iconEntry = metadata.find((item) => item.pack === pack && item.name === iconName);
    if (!iconEntry) {
      setError("Icon not found in metadata");
      return;
    }

    const loader = packLoaders[pack];
    if (!loader) {
      setError(`Unknown pack ${pack}`);
      return;
    }

    loader()
      .then((module) => {
        const Component = module[iconEntry.componentName] as IconComponent | undefined;
        if (!Component) {
          setError(`Component ${iconEntry.componentName} not found in pack ${pack}`);
          return;
        }
        setError(null);
        setIconComponent(() => Component);
      })
      .catch((err) => setError(`Failed to load pack ${pack}: ${err?.message}`));
  }, [pack, iconName, metadata]);

  const copyImport = async () => {
    const iconEntry = metadata.find((item) => item.pack === pack && item.name === iconName);
    if (iconEntry && IconComponent) {
      const source = `import { ${iconEntry.componentName} } from "davi-icons";`;
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  if (error) {
    return (
      <main className="page container" style={{ padding: "64px 0" }}>
        <h1>Icon not found</h1>
        <p style={{ color: "var(--muted)" }}>{error}</p>
        <Link href="/" className="button">
          Back to icons
        </Link>
      </main>
    );
  }

  if (!IconComponent) {
    return (
      <main className="page container" style={{ padding: "64px 0" }}>
        <p>Loading icon...</p>
      </main>
    );
  }

  const iconEntry = metadata.find((item) => item.pack === pack && item.name === iconName);

  return (
    <main className="page">
      <SiteHeader />

      <section className="section container">
        <div className="breadcrumb" style={{ marginBottom: 24, color: "var(--muted)" }}>
          <Link href="/">Icons</Link> / <span style={{ textTransform: "uppercase" }}>{pack}</span> / {iconName}
        </div>

        <div className="card" style={{ padding: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              background: "var(--panel-strong)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <IconComponent size={96} />
            <strong style={{ marginTop: 16, fontSize: 18 }}>{iconEntry?.componentName}</strong>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>
              {pack}:{iconName}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15 }}>Import usage</h3>
              <pre className="install-code" style={{ marginTop: 8 }}>
                {`import { ${iconEntry?.componentName} } from "davi-icons";`}
              </pre>
              <button type="button" className="button" style={{ marginTop: 8 }} onClick={copyImport}>
                {copied ? "Copied!" : "Copy Import"}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default function IconDetailPage({ params }: { params: { pack: string; icon: string } }) {
  const { pack, icon } = params;
  const [metadata, setMetadata] = useState<IconMetadata[]>([]);

  useEffect(() => {
    fetch("/metadata.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((err) => console.error("Failed to load metadata:", err));
  }, []);

  return (
    <Suspense
      fallback={
        <main className="page container" style={{ padding: "64px 0" }}>
          <p>Loading icon...</p>
        </main>
      }
    >
      <IconPreview pack={pack} iconName={icon} metadata={metadata} />
    </Suspense>
  );
}
