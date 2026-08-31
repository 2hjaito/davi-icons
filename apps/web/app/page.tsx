"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DvFrogArtist,
  DvFrogAstronaut,
  DvFrogDetective,
  DvFrogSuperman,
  DvBathingFrog,
} from "davi-icons";
import { DaviLogo } from "./components/logo";
import { ThemeSwitch } from "./components/theme-switch";
import { SiteFooter } from "./components/site-footer";

const demoIcons = [
  { name: "frog-artist", label: "Frog Artist" },
  { name: "frog-astronaut", label: "Frog Astronaut" },
  { name: "frog-detective", label: "Frog Detective" },
  { name: "frog-superman", label: "Frog Superman" },
  { name: "bathing-frog", label: "Bathing Frog" },
] as const;

const installOptions = {
  npm: "npm install davi-icons",
  pnpm: "pnpm add davi-icons",
  yarn: "yarn add davi-icons",
} as const;

export default function HomePage() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [installTool, setInstallTool] = useState<keyof typeof installOptions>("npm");

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

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

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
            <Link href="/icons/dv/frog-artist">Preview</Link>
          </nav>
          <div className="nav-actions">
            <ThemeSwitch dark={theme === "dark"} onToggle={toggleTheme} />
            <Link href="/icons" className="button button-primary">Browse icons</Link>
          </div>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-shell">
          <div>
            <span className="kicker">Davis pack</span>
            <h1>Beautiful icons for modern product teams.</h1>
            <p>
              Davi Icons is a clean collection of crisp, scalable SVGs built for product UI,
              documentation, dashboards, and design systems.
            </p>
            <div className="hero-actions">
              <Link href="/icons" className="button button-primary">Explore icons</Link>
              <Link href="/icons/dv/frog-artist" className="button">View example</Link>
            </div>
          </div>
          <div className="card hero-preview">
            <div className="preview-grid">
              {demoIcons.map((icon) => (
                <div key={icon.name} className="preview-item">
                  {icon.name === "frog-artist" && <DvFrogArtist size={34} />}
                  {icon.name === "frog-astronaut" && <DvFrogAstronaut size={34} />}
                  {icon.name === "frog-detective" && <DvFrogDetective size={34} />}
                  {icon.name === "frog-superman" && <DvFrogSuperman size={34} />}
                  {icon.name === "bathing-frog" && <DvBathingFrog size={34} />}
                  <strong>{icon.label}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="install-card card">
          <div className="install-header">
            <span className="kicker">Install</span>
            <h3>Get the package for your stack</h3>
          </div>

          <div className="install-actions" aria-label="Package manager selector">
            {Object.keys(installOptions).map((option) => (
              <button
                key={option}
                type="button"
                className={`pill ${installTool === option ? "active" : ""}`}
                onClick={() => setInstallTool(option as keyof typeof installOptions)}
              >
                {option}
              </button>
            ))}
          </div>

          <pre className="install-code">{installOptions[installTool]}</pre>
        </div>

        <div className="grid-cards">
          <article className="card metric-card">
            <span className="kicker">Library</span>
            <h3>5+</h3>
            <p>Curated Davis icons for quick product use.</p>
          </article>
          <article className="card metric-card">
            <span className="kicker">Formats</span>
            <h3>SVG</h3>
            <p>Vector first, crisp at any size.</p>
          </article>
          <article className="card metric-card">
            <span className="kicker">Stack</span>
            <h3>React</h3>
            <p>Ready for Next.js and modern React apps.</p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
