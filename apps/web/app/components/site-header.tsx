"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { DaviLogo } from "./logo";
import { ThemeSwitch } from "./theme-switch";

export const REPO_URL = "https://github.com/2hjaito/davi-icons";
export const NPM_URL = "https://www.npmjs.com/package/davi-icons";
export const VERSION = process.env.NEXT_PUBLIC_DAVI_VERSION ?? "";

export type Theme = "dark" | "light";
export const THEME_EVENT = "davi-theme-change";

const NAV = [
  { href: "/", label: "Icons" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [GithubIcon, setGithubIcon] = useState<ComponentType<{ size?: number }> | null>(null);

  // Load DvGithubGiphy lazily: a static import would pull the whole dv pack (shared with the
  // icon browser's dynamic pack loader) into every page's first-load bundle.
  useEffect(() => {
    import("davi-icons/dv")
      .then((mod) => setGithubIcon(() => mod.DvGithubGiphy))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("davi-theme", next);
    } catch {}
    window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" || pathname.startsWith("/icons") : pathname.startsWith(href));

  return (
    <header className="header">
      <div className="nav">
        {onMenuClick ? (
          <button type="button" className="menu-toggle" aria-label="Open pack menu" onClick={onMenuClick}>
            ☰
          </button>
        ) : null}
        <Link href="/" className="brand" aria-label="Davi Icons home">
          <DaviLogo size={22} />
          <span>Davi Icons</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined}>
              {item.label}
            </Link>
          ))}
          <div className={`nav-menu${pathname.startsWith("/changelog") ? " is-active" : ""}`}>
            <button type="button" className="nav-menu-trigger" aria-haspopup="true" aria-label={`GitHub and changelog, version ${VERSION}`}>
              {GithubIcon ? <GithubIcon size={22} /> : <span className="nav-menu-placeholder"><GithubMark /></span>}
              {VERSION ? <span className="nav-version">v{VERSION}</span> : null}
              <svg className="nav-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="nav-dropdown" role="menu">
              <a href={REPO_URL} target="_blank" rel="noreferrer" role="menuitem">
                <GithubMark />
                Repository
              </a>
              <Link href="/changelog" role="menuitem">
                <ChangelogMark />
                Changelog
              </Link>
              <a href={NPM_URL} target="_blank" rel="noreferrer" role="menuitem">
                <NpmMark />
                npm{VERSION ? <span className="nav-dropdown-meta">v{VERSION}</span> : null}
              </a>
            </div>
          </div>
          <ThemeSwitch dark={theme === "dark"} onToggle={toggleTheme} />
        </nav>
      </div>
    </header>
  );
}

function GithubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ChangelogMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7.5M11 18H8a2 2 0 0 1-2-2V8.5" />
      <path d="m15 3-2 3 2 3M9 21l2-3-2-3" />
    </svg>
  );
}

function NpmMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 2.5 8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5z" />
      <path d="M3.5 7.25 12 12l8.5-4.75M12 12v9.5" />
    </svg>
  );
}
