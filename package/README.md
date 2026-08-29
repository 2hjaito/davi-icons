# @davi-icons/icons

A modern icon platform with 35,000+ tree-shakeable icons for React and Next.js.

## Install

```bash
npm install @davi-icons/icons
# or
pnpm add @davi-icons/icons
# or
yarn add @davi-icons/icons
```

## Usage

You can import icons from the root entry or from subpath packs:

```tsx
// Root import
import { Bi5Circle, DvFrogArtist, HiAcademicCap } from "@davi-icons/icons";

// Subpath imports (faster bundling / tree-shaking)
import { Bi5Circle } from "@davi-icons/icons/bi";
import { DvFrogArtist } from "@davi-icons/icons/dv";

export function Example() {
  return (
    <div>
      <DvFrogArtist size={32} />
      <Bi5Circle size={24} color="#3d62ff" />
    </div>
  );
}
```

Every icon component accepts standard SVG props, including `size`, `color`, `width`, `height`, `className`, and `style`.

## Icon Packs Included

- `dv`: Davis Icons (First-party)
- `ai`: Academicons
- `bi`: Bootstrap Icons
- `ci`: CoreUI Icons
- `co`: Crypto Icons
- `di`: Devicon
- `fa`: Font Awesome (solid, regular, brands)
- `fi`: Feather Icons
- `fc`: Flat Color Icons
- `fl`: Flag Icons
- `gi`: Game Icons
- `hi`: Heroicons
- `io`: Ionicons
- `la`: Line Awesome
- `md`: Material Design Icons
- `oi`: Octicons
- `pi`: Pokemon Icons
- `pr`: PrimeIcons
- `pa`: Pixelarticons
- `px`: Phosphor Icons
- `ri`: Remix Icon
- `si`: Simple Icons
- `vi`: VSCode Icons
- `wi`: Weather Icons

## License

MIT © [Davi Icons](https://github.com/2hjaito/davi-icons). Each icon pack retains its original license.
