import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Davi Icons",
  description: "Framework-agnostic icon platform for React, Next.js, Vue, and Angular.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the stored theme before paint to avoid a flash of the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.setAttribute('data-theme',localStorage.getItem('davi-theme')||'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
