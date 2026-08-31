# Davi Icons (`davi-icons`)

A modern, framework-agnostic icon platform with 35,000+ tree-shakeable icons for React and Next.js.

## Features

- 🚀 **35,000+ icons** across 24 popular icon libraries (Bootstrap, Font Awesome, Feather, Heroicons, Material Design, Remix, etc.)
- 🌲 **Tree-shakeable ESM**: Only the icons you actually import end up in your production bundle.
- 📦 **Subpath Exports**: Import directly from subpaths like `davi-icons/bi` or `davi-icons/dv` for faster compilation.
- 🎨 **Full SVG customization**: Support for `size`, `color`, `className`, `style`, and standard SVG attributes.
- ⚡ **TypeScript First**: Full typings and auto-completion for all icon names and props.

## Install

```bash
npm install davi-icons
# or
pnpm add davi-icons
# or
yarn add davi-icons
```

## Usage

### Root Import

```tsx
import { Bi5Circle, DvFrogArtist, HiAcademicCap } from "davi-icons";

export function Example() {
  return (
    <div>
      <DvFrogArtist size={32} />
      <Bi5Circle size={24} color="#3d62ff" />
    </div>
  );
}
```

### Subpath Imports (Recommended for faster build & autocomplete)

```tsx
import { Bi5Circle } from "davi-icons/bi";
import { DvFrogArtist } from "davi-icons/dv";
import { HiAcademicCap } from "davi-icons/hi";
```

## Included Icon Packs

| Pack | Source |
| --- | --- |
| `dv` | Davis Icons (First-party) |
| `ai` | Academicons |
| `bi` | Bootstrap Icons |
| `ci` | CoreUI Icons |
| `co` | Crypto Icons |
| `di` | Devicon |
| `fa` | Font Awesome |
| `fi` | Feather Icons |
| `fc` | Flat Color Icons |
| `fl` | Flag Icons |
| `gi` | Game Icons |
| `hi` | Heroicons |
| `io` | Ionicons |
| `la` | Line Awesome |
| `md` | Material Design Icons |
| `oi` | Octicons |
| `pi` | Pokemon Icons |
| `pr` | PrimeIcons |
| `pa` | Pixelarticons |
| `px` | Phosphor Icons |
| `ri` | Remix Icon |
| `si` | Simple Icons |
| `vi` | VSCode Icons |
| `wi` | Weather Icons |

## License

MIT © [Davi Icons](https://github.com/2hjaito/davi-icons). Each icon pack retains its original license.
