# Changelog

## 0.3.2 — 2026-11-18

- Add Zalo (color and outline), Davish app, Adobe and macOS traffic-light icons to the Davis pack.
- Redesign the website: the icon browser is now the home page, with a compact header, Docs and Changelog pages.
- Icons load automatically while scrolling instead of a "Load more" button.
- Mark generated icon exports as `/* @__PURE__ */` so bundlers can drop unused icons from a pack.

## 0.3.1 — 2026-11-09

- Bake squircle, sheen and edge into the Davish app icons.

## 0.3.0 — 2026-11-09

- Add the Davish app icons to the Davis pack.

## 0.2.2 — 2026-09-17

- Add new Davis icons and the Davis logo SVG.

## 0.2.1 — 2026-08-31

- Default icon dimensions to `1em`.

## 0.2.0 — 2026-08-31

- Improve SVG cleanup when building icons.

## 0.1.7 — 2026-08-31

- Add Davis icons.

## 0.1.4 — 2026-08-31

- Add Lucide, Tabler and Typicons packs.
- Stop tracking generated icon files; build them with `icons:sync`.

## 0.1.2 — 2026-08-31

- Rename the package to `davi-icons`.

## 0.1.0 — 2026-08-29

- First release: icon generation pipeline and web icon browser.
- Prefix SVG ids at build time to avoid collisions.
