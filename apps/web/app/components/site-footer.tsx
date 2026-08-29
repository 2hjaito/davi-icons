import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>© {new Date().getFullYear()} Davi Icons · MIT · each pack keeps its original license</span>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/icons">Icons</Link>
          <a href="https://github.com/2hjaito/davi-icons" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
