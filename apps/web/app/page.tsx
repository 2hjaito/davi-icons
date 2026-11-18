"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { packLoaders, packNames, type IconComponent } from "./icons/packs.generated";
import { SiteHeader, THEME_EVENT, type Theme } from "./components/site-header";

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

const DEFAULT_COLOR: Record<Theme, string> = { light: "#222F3D", dark: "#e5eefb" };

export default function IconsPage() {
  const [query, setQuery] = useState("");
  const [icons, setIcons] = useState<IconMetadata[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<IconMetadata | null>(null);
  const [copied, setCopied] = useState(false);
  const [packModules, setPackModules] = useState<Record<string, Record<string, IconComponent>>>({});
  const requestedPacks = useRef(new Set<string>());
  const [scale, setScale] = useState(2.4);
  const [color, setColor] = useState(DEFAULT_COLOR.light);
  const [animation, setAnimation] = useState<Animation>("none");
  const [speed, setSpeed] = useState(2);
  const [flip, setFlip] = useState<Flip>("normal");
  const [navOpen, setNavOpen] = useState(false);

  // Follow the theme's default icon color, unless the user picked a custom one.
  useEffect(() => {
    const initial: Theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setColor(DEFAULT_COLOR[initial]);
    const onTheme = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      setColor((prev) => (prev === DEFAULT_COLOR.light || prev === DEFAULT_COLOR.dark ? DEFAULT_COLOR[next] : prev));
    };
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

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

  const searchRef = useRef<HTMLDivElement>(null);

  // New results start at the top of the grid. If the user is already scrolled past the hero,
  // keep the sticky search pinned there instead of jumping back to the top of the page.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    const search = searchRef.current;
    if (!search) return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    const pinnedAt = search.parentElement ? search.offsetTop - header : 0;
    if (window.scrollY > pinnedAt) window.scrollTo({ top: pinnedAt });
  }, [query, selectedPack]);

  const visibleIcons = useMemo(() => filteredIcons.slice(0, visibleCount), [filteredIcons, visibleCount]);
  const hasMore = visibleCount < filteredIcons.length;
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll: load the next page when the sentinel below the grid nears the viewport.
  // Re-observing after each page means a sentinel still in view (tall screens) keeps loading.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin: "0px 0px 800px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

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

  const importSource = selected ? `import { ${selected.componentName} } from "davi-icons";` : "";

  const copyImport = async () => {
    if (!importSource) return;
    await navigator.clipboard.writeText(importSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const selectPack = (pack: string | null) => {
    setSelectedPack(pack);
    setNavOpen(false);
  };

  const animationClass = animation === "none" ? "davi-tint" : `davi-tint davi-anim davi-anim-${animation}`;
  const previewStyle = {
    color,
    transform: FLIP_TRANSFORM[flip],
    ["--davi-speed" as string]: `${speed}s`,
  } as CSSProperties;

  return (
    <main className="page">
      <SiteHeader onMenuClick={() => setNavOpen(true)} />

      <div className="icons-layout">
        {navOpen ? <button type="button" className="icons-backdrop" aria-label="Close pack menu" onClick={() => setNavOpen(false)} /> : null}
        <aside className={`icons-side icons-nav${navOpen ? " is-open" : ""}`} aria-label="Icon packs">
          <PackButton label="All" count={icons.length} active={selectedPack === null} onClick={() => selectPack(null)} />
          {packs.map(([pack, count]) => (
            <PackButton
              key={pack}
              label={packNames[pack] ?? pack.toUpperCase()}
              count={count}
              active={selectedPack === pack}
              onClick={() => selectPack(pack)}
            />
          ))}
        </aside>

        <section className="icons-main">
          <div className="icons-hero">
            <h1>{selectedPack ? packNames[selectedPack] ?? selectedPack.toUpperCase() : "Davi Icons"}</h1>
            <p>Tree-shakeable SVG icons from popular icon packs, for React and Next.js.</p>
          </div>

          {/* Sticks under the header so search stays reachable deep into the grid. */}
          <div className="icons-search" ref={searchRef}>
            <label className="search-box" aria-label="Search icons">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${filteredIcons.length} icons...`} />
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

            {hasMore ? (
              <div ref={sentinelRef} aria-hidden="true" className="icons-more">
                Loading more… ({filteredIcons.length - visibleCount} left)
              </div>
            ) : null}

            {icons.length > 0 && filteredIcons.length === 0 ? <p className="icons-more">No icons found.</p> : null}
          </div>
        </section>

        <aside className="icons-side icons-panel" aria-label="Preview options">
          <Field label="Scale" value={scale.toFixed(1)}>
            <input type="range" min={1} max={5} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </Field>

          <Field label="Color" value={color}>
            <input type="color" className="color-swatch" value={color} onChange={(e) => setColor(e.target.value)} />
          </Field>

          <Field label="Animation">
            <div className="option-grid">
              {ANIMATIONS.map((item) => (
                <OptionButton key={item} label={item} active={animation === item} onClick={() => setAnimation(item)} />
              ))}
            </div>
          </Field>

          <Field label="Speed" value={`${speed}s`}>
            <input type="range" min={0.5} max={5} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
          </Field>

          <Field label="Flip">
            <div className="option-grid option-grid-2">
              {(Object.keys(FLIP_TRANSFORM) as Flip[]).map((item) => (
                <OptionButton key={item} label={item} active={flip === item} onClick={() => setFlip(item)} />
              ))}
            </div>
          </Field>
        </aside>
      </div>

      {selected ? (
        <div className="icons-toast" role="status">
          <code>{importSource}</code>
          <button type="button" onClick={copyImport}>
            {copied ? "Copied" : "Copy"}
          </button>
          <Link href={`/icons/${selected.pack}/${selected.name}`}>Details</Link>
          <button type="button" aria-label="Close" className="icons-toast-close" onClick={() => setSelected(null)}>
            ×
          </button>
        </div>
      ) : null}
    </main>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">
        <span>{label}</span>
        {value ? <span className="field-value">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`option-btn${active ? " is-active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function PackButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`pack-btn${active ? " is-active" : ""}`} onClick={onClick}>
      <span>{label}</span>
      <span className="pack-count">{count}</span>
    </button>
  );
}
