<p align="center">
  <img src="assets/logo.svg" width="96" height="96" alt="Davi Icons logo" />
</p>

<h1 align="center">Davi Icons</h1>

<p align="center">
  A framework-agnostic icon platform. One import path, 13,000+ tree-shakeable icons.
</p>

## Install

```bash
pnpm add davi-icons
```

## Usage

```tsx
import { Bi5Circle, DvFrogArtist } from "davi-icons";

export function Example() {
  return (
    <>
      <DvFrogArtist size={32} />
      <Bi5Circle size={24} color="#6366f1" />
    </>
  );
}
```

Every icon is a standalone ESM export and the package is marked `sideEffects: false`, so bundlers ship only the icons you import.

## Icon packs

| Pack | Source | Icons |
| --- | --- | --- |
| `dv` | Davis (first-party) | 6 |
| `ai` | Academicons | 158 |
| `bi` | Bootstrap Icons | 2078 |
| `ci` | CoreUI Icons | 562 |
| `co` | Crypto Icons | 483 |
| `di` | Devicon (tech logos) | 1877 |
| `fa` | Font Awesome (solid + regular + brands) | 2060 |
| `fi` | Feather Icons | 287 |
| `fc` | Flat Color Icons | 329 |
| `fl` | Flag Icons | 271 |
| `gi` | Game Icons | 4176 |
| `hi` | Heroicons (outline + solid) | 648 |
| `io` | Ionicons | 1357 |
| `la` | Line Awesome | 1544 |
| `md` | Material Design Icons | 7447 |
| `oi` | Octicons | 743 |
| `pi` | Pokemon Icons | 18 |
| `pr` | PrimeIcons | 313 |
| `pa` | Pixelarticons | 1036 |
| `px` | Phosphor Icons (regular) | 1512 |
| `ri` | Remix Icon | 3229 |
| `si` | Simple Icons | 3457 |
| `vi` | VSCode Icons | 1588 |
| `wi` | Weather Icons | 219 |

Total: **35,398 icons**.

## Development

```bash
pnpm install
pnpm icons:sync   # download packs, generate modules + metadata
pnpm build        # compile the library
pnpm --filter web dev  # browse icons at /icons
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the pipeline details.

## License

MIT for this project. Each bundled pack keeps its original license (see `iconpacks/index.ts`).
