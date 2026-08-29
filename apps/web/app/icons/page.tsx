"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { packLoaders, packNames, type IconComponent } from "./packs.generated";
import { DaviLogo } from "../components/logo";
import { ThemeSwitch } from "../components/theme-switch";
import { SiteFooter } from "../components/site-footer";

type IconMetadata = {
  pack: string;
  name: string;
  componentName: string;
};

const PAGE_SIZE = 200;

const ANIMATIONS = ["none", "spin", "pulse", "flash", "float", "ring"] as const;
type Animation = (typeof ANIMATIONS)[number];
type Flip = "normal" | "horizontal" | "vertical" | "both";

const FLIP_TRANSFORM: Record<Flip, string> = {
  normal: "none",
  horizontal: "scaleX(-1)",
  vertical: "scaleY(-1)",
  both: "scale(-1)",
};

export default function IconsPage() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [icons, setIcons] = useState<IconMetadata[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [toast, setToast] = useState<IconMetadata | null>(null);
  const [selected, setSelected] = useState<IconMetadata | null>(null);
  const [copied, setCopied] = useState(false);
  const [packModules, setPackModules] = useState<Record<string, Record<string, IconComponent>>>({});
  const requestedPacks = useRef(new Set<string>());
  const [scale, setScale] = useState(2.4);
  const [color, setColor] = useState("#222F3D");
  const [animation, setAnimation] = useState<Animation>("none");
  const [speed, setSpeed] = useState(2);
  const [flip, setFlip] = useState<Flip>("normal");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("davi-theme") as "dark" | "light" | null;
    const initialTheme = savedTheme ?? "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      setColor("#7c9cff");
    } else {
      setColor("#222F3D");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("davi-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("/metadata.json")
      .then((res) => res.json())
      .then((data: IconMetadata[]) => setIcons(data))
      .catch((err) => console.error("Failed to load metadata:", err));
  }, []);

  const packs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const icon of icons) counts.set(icon.pack, (counts.get(icon.pack) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) =>
      (packNames[a[0]] ?? a[0]).localeCompare(packNames[b[0]] ?? b[0])
    );
  }, [icons]);

  const filteredIcons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return icons.filter((icon) => {
      if (selectedPack && icon.pack !== selectedPack) return false;
      if (!q) return true;
      return icon.name.toLowerCase().includes(q) || icon.componentName.toLowerCase().includes(q);
    });
  }, [icons, selectedPack, query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedPack]);

  const visibleIcons = useMemo(() => filteredIcons.slice(0, visibleCount), [filteredIcons, visibleCount]);

  // Only fetch the pack chunks needed by the icons currently on screen.
  useEffect(() => {
    for (const icon of visibleIcons) {
      if (requestedPacks.current.has(icon.pack)) continue;
      const loader = packLoaders[icon.pack];
      if (!loader) continue;
      requestedPacks.current.add(icon.pack);
      loader()
        .then((module) => setPackModules((prev) => ({ ...prev, [icon.pack]: module })))
        .catch((err) => console.error(`Failed to load pack ${icon.pack}:`, err));
    }
  }, [visibleIcons]);

  const importSource = toast ? `import { ${toast.componentName} } from "@davi-icons/icons";` : "";

  const copyImport = async () => {
    if (!importSource) return;
    await navigator.clipboard.writeText(importSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const animationClass = animation === "none" ? "davi-tint" : `davi-tint davi-anim davi-anim-${animation}`;
  const previewStyle = {
    color,
    transform: FLIP_TRANSFORM[flip],
    ["--davi-speed" as string]: `${speed}s`,
  } as CSSProperties;
  const SelectedComponent = selected ? packModules[selected.pack]?.[selected.componentName] : undefined;

  return (
    <main className="page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
              dark={theme === "dark"}
              onToggle={() => {
                setTheme((current) => {
                  const next = current === "dark" ? "light" : "dark";
                  setColor((prev) => {
                    if (prev === "#7c9cff" && next === "light") return "#222F3D";
                    if (prev === "#222F3D" && next === "dark") return "#7c9cff";
                    return prev;
                  });
                  return next;
                });
              }}
            />
            <button type="button" className="menu-toggle" aria-label="Open pack menu" onClick={() => setNavOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="icons-layout">
        {navOpen ? <button type="button" className="icons-backdrop" aria-label="Close pack menu" onClick={() => setNavOpen(false)} /> : null}
        <aside className={`icons-side icons-nav${navOpen ? " is-open" : ""}`}>
          <PackButton
            label="All"
            count={icons.length}
            active={selectedPack === null}
            onClick={() => {
              setSelectedPack(null);
              setNavOpen(false);
            }}
          />
          {packs.map(([pack, count]) => (
            <PackButton
              key={pack}
              label={packNames[pack] ?? pack.toUpperCase()}
              count={count}
              active={selectedPack === pack}
              onClick={() => {
                setSelectedPack(pack);
                setNavOpen(false);
              }}
            />
          ))}
        </aside>

        <section className="icons-main">
          <div className="icons-toolbar">
            <h1 style={{ margin: "0 0 2px", fontSize: 20 }}>
              {selectedPack ? packNames[selectedPack] ?? selectedPack.toUpperCase() : "All icons"}
            </h1>
            <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 13 }}>{filteredIcons.length} icons</p>
            <label className="search-box" aria-label="Search icons">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${filteredIcons.length} icons...`}
              />
            </label>
          </div>

          <div className="icons-body">
            <div className="icons-grid">
              {visibleIcons.map((icon) => {
                const Component = packModules[icon.pack]?.[icon.componentName];
                const isActive = selected?.pack === icon.pack && selected?.name === icon.name;
                return (
                  <button
                    key={`${icon.pack}:${icon.name}`}
                    type="button"
                    className={`icon-cell${isActive ? " is-active" : ""}`}
                    onClick={() => {
                      setSelected(icon);
                      setToast(icon);
                      setCopied(false);
                    }}
                    title={icon.componentName}
                  >
                    {Component ? (
                      <span className={animationClass} style={previewStyle}>
                        <Component size={Math.round(20 * scale)} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {visibleCount < filteredIcons.length ? (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <button type="button" className="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Load more ({filteredIcons.length - visibleCount} left)
                </button>
              </div>
            ) : null}

            {filteredIcons.length === 0 ? <p style={{ color: "var(--muted)" }}>No icons found.</p> : null}
          </div>
        </section>

        <aside className="icons-side icons-panel">
          <div>
            <h2 style={{ margin: "0 0 12px", fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)" }}>
              Details
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: 16,
                minHeight: 120,
                justifyContent: "center",
                background: "var(--panel-strong)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              {selected && SelectedComponent ? (
                <>
                  <span className={animationClass} style={previewStyle}>
                    <SelectedComponent size={Math.round(24 * scale)} />
                  </span>
                  <strong style={{ fontSize: 13, textAlign: "center", overflowWrap: "anywhere" }}>{selected.componentName}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{packNames[selected.pack] ?? selected.pack}</span>
                  <Link href={`/icons/${selected.pack}/${selected.name}`} style={{ fontSize: 12, color: "var(--accent)" }}>
                    Open detail page
                  </Link>
                </>
              ) : (
                <span style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Select an icon to preview it here.</span>
              )}
            </div>
          </div>

          <Field label="Scale" value={scale.toFixed(1)}>
            <input type="range" min={1} max={5} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} style={{ width: "100%" }} />
          </Field>

          <Field label="Color">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: 44, height: 32, padding: 0, border: "1px solid var(--border)", borderRadius: 8, background: "transparent" }}
              />
              <code style={{ fontSize: 12, color: "var(--muted)" }}>{color}</code>
            </div>
          </Field>

          <Field label="Animation">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ANIMATIONS.map((item) => (
                <OptionButton key={item} label={item} active={animation === item} onClick={() => setAnimation(item)} />
              ))}
            </div>
          </Field>

          <Field label="Speed" value={`${speed}s`}>
            <input type="range" min={0.5} max={5} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "100%" }} />
          </Field>

          <Field label="Flip">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.keys(FLIP_TRANSFORM) as Flip[]).map((item) => (
                <OptionButton key={item} label={item} active={flip === item} onClick={() => setFlip(item)} />
              ))}
            </div>
          </Field>
        </aside>
      </div>

      {toast ? (
        <div className="icons-toast">
          <code style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>
            {importSource}
          </code>
          <button
            type="button"
            onClick={copyImport}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setToast(null)}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      ) : null}

      <SiteFooter />
    </main>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
        <span>{label}</span>
        {value ? <span style={{ color: "var(--muted)", fontWeight: 400 }}>{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 10px",
        fontSize: 12,
        borderRadius: 8,
        textTransform: "capitalize",
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--text)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function PackButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="icons-pack-btn"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        border: `1px solid ${active ? "var(--accent)" : "transparent"}`,
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--text)",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>{count}</span>
    </button>
  );
}
