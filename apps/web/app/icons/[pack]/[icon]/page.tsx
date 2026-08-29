"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type ComponentType } from "react";
import { packLoaders } from "../../packs.generated";
import { DaviLogo } from "../../../components/logo";
import { ThemeSwitch } from "../../../components/theme-switch";
import { SiteFooter } from "../../../components/site-footer";

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
      const source = `import { ${iconEntry.componentName} } from "@davi-icons/icons";`;
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
        <Link href="/icons" className="button">
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
      <header className="header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Davi Icons home">
            <span className="brand-mark">
              <DaviLogo />
            </span>
            <span>DAVI ICONS</span>
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/icons">Icons</Link>
          </nav>
          <div className="nav-actions">
            <ThemeSwitch
              dark={typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"}
              onToggle={() => {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
                window.localStorage.setItem("davi-theme", next);
              }}
            />
          </div>
        </div>
      </header>

      <section className="section container">
        <div className="breadcrumb" style={{ marginBottom: 24, color: "var(--muted)" }}>
          <Link href="/icons">Icons</Link> / <span style={{ textTransform: "uppercase" }}>{pack}</span> / {iconName}
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
              <h3>Import Usage</h3>
              <pre className="install-code" style={{ marginTop: 8 }}>
                {`import { ${iconEntry?.componentName} } from "@davi-icons/icons";`}
              </pre>
              <button type="button" className="button" style={{ marginTop: 8 }} onClick={copyImport}>
                {copied ? "Copied!" : "Copy Import"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export default function IconDetailPage({ params }: { params: { pack: string; icon: string } }) {
  const { pack, icon } = params;
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [metadata, setMetadata] = useState<IconMetadata[]>([]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("davi-theme") as "dark" | "light" | null;
    const nextTheme = savedTheme ?? "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("davi-theme", theme);
  }, [theme]);

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
