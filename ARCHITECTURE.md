# Architecture

This repository currently follows a minimal, source-first structure inspired by the oh-vue-icons project.

## Layout

- `apps/web`: Next.js preview app for browsing generated icons.
- `iconpacks/index.ts`: manifest list used to resolve local and remote icon packs.
- `icons/davis`: first-party Davis SVG sources kept in source control.
- `package/`: main library package containing the runtime renderer and generated pack exports.
- `package/icons`: generated pack modules and metadata, gitignored.
- `.cache/`: temporary download/extract storage for remote packs, gitignored.
- `scripts/`: sync/build pipeline for download, SVG normalization, and generation.

## Package behavior

- The canonical icon source is framework-neutral SVG data.
- Generation is done at build time, not at runtime.
- The app imports actual generated pack modules from `package/icons` via the `@davi-icons/icons` workspace package.
- Consumers import from the single root entry: `import { Bi5Circle } from "@davi-icons/icons";`. Every icon is a standalone `const` export in an ESM module with `sideEffects: false`, so bundlers tree-shake down to only the icons that are imported.
- Remote third-party packs are downloaded into `.cache/` and not committed.
- Davis SVGs stay committed under `icons/davis` and are exported as the `dv` pack.
- `package/icons/*.ts`, `package/icons/metadata.json`, `apps/web/public/metadata.json`, and `apps/web/app/icons/packs.generated.ts` are all generated and gitignored (regenerate with `pnpm icons:sync`). The root `npm run build` runs `icons:sync` automatically before `turbo run build`.

## Generated metadata

- During `pnpm icons:sync`, a `metadata.json` file is generated in `package/icons/` containing all icon definitions.
- Metadata structure:
  ```json
  [
    {
      "pack": "dv",
      "name": "davi-logo",
      "componentName": "DvDaviLogo"
    },
    {
      "pack": "bi",
      "name": "github",
      "componentName": "BiGithub"
    }
  ]
  ```
- The metadata.json is copied to `apps/web/public/metadata.json` for runtime access by the web app.
- Web app fetches metadata at runtime to populate the icon list and detail routes.

## Web app icon browser

- `/icons` - displays all generated icons (currently 35,398 icons from 24 packs)
  - Fetches `metadata.json` at runtime
  - Sidebar filters by pack, search filters by icon or component name
  - Renders real icon components, 200 at a time ("Load more")
  - Clicking an icon opens a bottom toast with the import line and a copy button

- `/icons/[pack]/[icon]` - displays a single icon detail page
  - Reads metadata.json to verify icon exists
  - Loads the pack chunk through the generated `packLoaders` map in `apps/web/app/icons/packs.generated.ts`
  - Loads the component by name from the metadata
  - Shows import usage code

## Current generated packs

See the pack table in [README.md](README.md). Pack ids and sources live in `iconpacks/index.ts`; `pnpm icons:sync` regenerates every pack listed in `manifests`.

The build pipeline is intentionally simple:

1. read manifest
2. download/extract remote archives into `.cache/`
3. glob SVG sources
4. optimize and parse SVG into icon nodes
5. write generated modules to `package/icons`
6. generate `metadata.json` with all icon definitions
7. copy `metadata.json` to web public directory
8. sync `package.json` subpath exports and regenerate `apps/web/app/icons/packs.generated.ts`
