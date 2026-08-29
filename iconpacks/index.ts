function toPascalCase(value: string): string {
  return value
    .replace(/[-_\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export interface PackContent {
  files: string;
  formatter: (name: string) => string;
  prefix?: (name: string) => string;
  raw?: (name: string) => string;
  nameFromPath?: (file: string) => string;
  scale?: number;
}

export interface PackManifest {
  id: string;
  name: string;
  downloadFileName?: string;
  downloadURL?: string;
  local?: boolean;
  contents: PackContent[];
  multiColor?: boolean;
  projectUrl: string;
  website?: string;
  license: {
    name: string;
    url: string;
  };
}

export const davisIcons: PackManifest = {
  id: "dv",
  name: "Davis Icons",
  local: true,
  contents: [
    {
      files: "icons/davis/**/*.svg",
      formatter: (name) => `Dv${toPascalCase(name)}`,
      prefix: (name) => `dv-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/dangth/davi-icons",
  website: "https://davi-icons.local",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const bootstrapIcons: PackManifest = {
  id: "bi",
  name: "Bootstrap Icons",
  downloadFileName: "bootstrap-icons.tar.gz",
  downloadURL: "https://codeload.github.com/twbs/icons/tar.gz/refs/heads/main",
  contents: [
    {
      files: "icons/*.svg",
      formatter: (name) => `Bi${toPascalCase(name)}`,
      prefix: (name) => `bi-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/twbs/icons",
  website: "https://icons.getbootstrap.com/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const featherIcons: PackManifest = {
  id: "fi",
  name: "Feather Icons",
  downloadFileName: "feather-icons.tar.gz",
  downloadURL: "https://codeload.github.com/feathericons/feather/tar.gz/refs/heads/main",
  contents: [
    {
      files: "icons/*.svg",
      formatter: (name) => `Fi${toPascalCase(name)}`,
      prefix: (name) => `fi-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/feathericons/feather",
  website: "https://feathericons.com/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const heroIcons: PackManifest = {
  id: "hi",
  name: "Heroicons",
  downloadFileName: "heroicons.tar.gz",
  downloadURL: "https://codeload.github.com/tailwindlabs/heroicons/tar.gz/refs/heads/master",
  contents: [
    {
      files: "optimized/24/outline/*.svg",
      formatter: (name) => `Hi${toPascalCase(name)}`,
      prefix: (name) => `hi-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
    {
      files: "optimized/24/solid/*.svg",
      formatter: (name) => `Hi${toPascalCase(name)}Solid`,
      prefix: (name) => `hi-${name}-solid`,
      nameFromPath: (file) => `${file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown"}-solid`,
    },
  ],
  projectUrl: "https://github.com/tailwindlabs/heroicons",
  website: "https://heroicons.com/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const ionIcons: PackManifest = {
  id: "io",
  name: "Ionicons",
  downloadFileName: "ionicons.tar.gz",
  downloadURL: "https://codeload.github.com/ionic-team/ionicons/tar.gz/refs/heads/main",
  contents: [
    {
      files: "src/svg/*.svg",
      formatter: (name) => `Io${toPascalCase(name)}`,
      prefix: (name) => `io-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/ionic-team/ionicons",
  website: "https://ionic.io/ionicons",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const octIcons: PackManifest = {
  id: "oi",
  name: "Octicons",
  downloadFileName: "octicons.tar.gz",
  downloadURL: "https://codeload.github.com/primer/octicons/tar.gz/refs/heads/main",
  contents: [
    {
      files: "icons/*.svg",
      formatter: (name) => `Oi${toPascalCase(name)}`,
      prefix: (name) => `oi-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/primer/octicons",
  website: "https://primer.style/octicons/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const phosphorIcons: PackManifest = {
  id: "px",
  name: "Phosphor Icons",
  downloadFileName: "phosphor-icons.tar.gz",
  downloadURL: "https://codeload.github.com/phosphor-icons/core/tar.gz/refs/heads/main",
  contents: [
    {
      files: "assets/regular/*.svg",
      formatter: (name) => `Px${toPascalCase(name)}`,
      prefix: (name) => `px-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/phosphor-icons/core",
  website: "https://phosphoricons.com/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const remixIcons: PackManifest = {
  id: "ri",
  name: "Remix Icon",
  downloadFileName: "remixicon.tar.gz",
  downloadURL: "https://codeload.github.com/Remix-Design/RemixIcon/tar.gz/refs/heads/master",
  contents: [
    {
      files: "icons/**/*.svg",
      formatter: (name) => `Ri${toPascalCase(name)}`,
      prefix: (name) => `ri-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/Remix-Design/RemixIcon",
  website: "https://remixicon.com/",
  license: { name: "Apache-2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
};

export const simpleIcons: PackManifest = {
  id: "si",
  name: "Simple Icons",
  downloadFileName: "simple-icons.tar.gz",
  downloadURL: "https://codeload.github.com/simple-icons/simple-icons/tar.gz/refs/heads/master",
  contents: [
    {
      files: "icons/*.svg",
      formatter: (name) => `Si${toPascalCase(name)}`,
      prefix: (name) => `si-${name}`,
      nameFromPath: (file) => file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown",
    },
  ],
  projectUrl: "https://github.com/simple-icons/simple-icons",
  website: "https://simpleicons.org/",
  license: { name: "CC0-1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
};

function basename(file: string): string {
  return file.split("/").pop()?.replace(/\.svg$/i, "") ?? "unknown";
}

function simplePack(options: {
  id: string;
  name: string;
  repo: string;
  branch: string;
  files: string;
  projectUrl?: string;
  website?: string;
  license?: { name: string; url: string };
  multiColor?: boolean;
}): PackManifest {
  const prefix = options.id.charAt(0).toUpperCase() + options.id.slice(1);
  return {
    id: options.id,
    name: options.name,
    downloadFileName: `${options.id}.tar.gz`,
    downloadURL: `https://codeload.github.com/${options.repo}/tar.gz/refs/heads/${options.branch}`,
    multiColor: options.multiColor,
    contents: [
      {
        files: options.files,
        formatter: (name) => `${prefix}${toPascalCase(name)}`,
        prefix: (name) => `${options.id}-${name}`,
        nameFromPath: basename,
      },
    ],
    projectUrl: options.projectUrl ?? `https://github.com/${options.repo}`,
    website: options.website,
    license: options.license ?? { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  };
}

export const academicons = simplePack({
  id: "ai",
  name: "Academicons",
  repo: "jpswalsh/academicons",
  branch: "master",
  files: "svg/*.svg",
  website: "https://jpswalsh.github.io/academicons/",
  license: { name: "SIL OFL 1.1", url: "https://scripts.sil.org/OFL" },
});

export const coreUiIcons = simplePack({
  id: "ci",
  name: "CoreUI Icons",
  repo: "coreui/coreui-icons",
  branch: "main",
  files: "svg/free/*.svg",
  website: "https://coreui.io/icons/",
  license: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
});

export const cryptoIcons = simplePack({
  id: "co",
  name: "Crypto Icons",
  repo: "spothq/cryptocurrency-icons",
  branch: "master",
  files: "svg/color/*.svg",
  multiColor: true,
  website: "http://cryptoicons.co/",
  license: { name: "CC0-1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
});

export const flatColorIcons = simplePack({
  id: "fc",
  name: "Flat Color Icons",
  repo: "icons8/flat-color-icons",
  branch: "master",
  files: "svg/*.svg",
  multiColor: true,
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const flagIcons = simplePack({
  id: "fl",
  name: "Flag Icons",
  repo: "lipis/flag-icons",
  branch: "main",
  files: "flags/4x3/*.svg",
  multiColor: true,
  website: "https://flagicons.lipis.dev/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const gameIcons = simplePack({
  id: "gi",
  name: "Game Icons",
  repo: "game-icons/icons",
  branch: "master",
  files: "**/*.svg",
  website: "https://game-icons.net/",
  license: { name: "CC BY 3.0", url: "https://creativecommons.org/licenses/by/3.0/" },
});

export const lineAwesome = simplePack({
  id: "la",
  name: "Line Awesome",
  repo: "icons8/line-awesome",
  branch: "master",
  files: "svg/*.svg",
  website: "https://icons8.com/line-awesome",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const materialDesignIcons = simplePack({
  id: "md",
  name: "Material Design Icons",
  repo: "Templarian/MaterialDesign-SVG",
  branch: "master",
  files: "svg/*.svg",
  website: "https://pictogrammers.com/library/mdi/",
  license: { name: "Apache-2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
});

export const pokemonIcons = simplePack({
  id: "pi",
  name: "Pokemon Icons",
  repo: "duiker101/pokemon-type-svg-icons",
  branch: "master",
  files: "icons/*.svg",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const primeIcons = simplePack({
  id: "pr",
  name: "PrimeIcons",
  repo: "primefaces/primeicons",
  branch: "master",
  files: "raw-svg/*.svg",
  website: "https://primefaces.github.io/primeicons/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const pixelartIcons = simplePack({
  id: "pa",
  name: "Pixelarticons",
  repo: "halfmage/pixelarticons",
  branch: "master",
  files: "svg/*.svg",
  website: "https://pixelarticons.com/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const vscodeIcons = simplePack({
  id: "vi",
  name: "VSCode Icons",
  repo: "vscode-icons/vscode-icons",
  branch: "master",
  files: "icons/*.svg",
  multiColor: true,
  website: "https://github.com/vscode-icons/vscode-icons",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
});

export const weatherIcons = simplePack({
  id: "wi",
  name: "Weather Icons",
  repo: "erikflowers/weather-icons",
  branch: "master",
  files: "svg/*.svg",
  website: "https://erikflowers.github.io/weather-icons/",
  license: { name: "SIL OFL 1.1", url: "https://scripts.sil.org/OFL" },
});

export const fontAwesome: PackManifest = {
  id: "fa",
  name: "Font Awesome",
  downloadFileName: "fa.tar.gz",
  downloadURL: "https://codeload.github.com/FortAwesome/Font-Awesome/tar.gz/refs/heads/6.x",
  contents: [
    {
      files: "svgs/solid/*.svg",
      formatter: (name) => `Fa${toPascalCase(name)}`,
      prefix: (name) => `fa-${name}`,
      nameFromPath: basename,
    },
    {
      files: "svgs/regular/*.svg",
      formatter: (name) => `Fa${toPascalCase(name)}`,
      prefix: (name) => `fa-${name}`,
      nameFromPath: (file) => `${basename(file)}-regular`,
    },
    {
      files: "svgs/brands/*.svg",
      formatter: (name) => `Fa${toPascalCase(name)}`,
      prefix: (name) => `fa-${name}`,
      nameFromPath: (file) => `${basename(file)}-brands`,
    },
  ],
  projectUrl: "https://github.com/FortAwesome/Font-Awesome",
  website: "https://fontawesome.com/",
  license: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
};

export const devIcons: PackManifest = {
  id: "di",
  name: "Devicon",
  downloadFileName: "di.tar.gz",
  downloadURL: "https://codeload.github.com/devicons/devicon/tar.gz/refs/heads/master",
  multiColor: true,
  contents: [
    {
      files: "icons/**/*.svg",
      formatter: (name) => `Di${toPascalCase(name)}`,
      prefix: (name) => `di-${name}`,
      nameFromPath: basename,
    },
  ],
  projectUrl: "https://github.com/devicons/devicon",
  website: "https://devicon.dev/",
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};

export const manifests: PackManifest[] = [
  davisIcons,
  academicons,
  bootstrapIcons,
  coreUiIcons,
  cryptoIcons,
  devIcons,
  fontAwesome,
  featherIcons,
  flatColorIcons,
  flagIcons,
  gameIcons,
  heroIcons,
  ionIcons,
  lineAwesome,
  materialDesignIcons,
  octIcons,
  pokemonIcons,
  primeIcons,
  pixelartIcons,
  phosphorIcons,
  remixIcons,
  simpleIcons,
  vscodeIcons,
  weatherIcons,
];
