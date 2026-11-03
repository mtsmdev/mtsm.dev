# Moatasem — personal portfolio

Portfolio for Moatasem Alhumsi Alrefaai, featuring an animated Dell XPS 15 9500, a CV preview, and projects from web, mobile, and desktop development. Available in Dutch, English and Arabic (right-to-left).

## Run locally

Requires Node.js 22 or newer. There are no npm dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173/.

## Validate and build

```sh
npm run check
npm run build
```

The static website is generated in `dist/`. The server is only for local development; production hosting needs only the generated files.

## Structure

- `prototype/`: website source, styles, and Three.js scene.
- `prototype/i18n.js`: English and Arabic translations and the language switcher. Dutch is the source text in `index.html`.
- `prototype/assets/`: CV, project screenshots, and laptop geometry/textures.
- `prototype/vendor/`: locally bundled Three.js runtime.
- `scripts/`: validation and static build.
- `docs/`: asset provenance and hosting notes.

## Experience

Projecten is the default view. Mijn CV displays the CV on the laptop and opens the PDF when clicked. Contact displays a custom letter design and opens an email to career@mtsm.dev. Scrolling or choosing Bekijk mijn werk centres the laptop and enters the project section.

The renderer warms up shaders and textures before the intro, renders at a fixed pixel ratio within a pixel budget (stepping down only when frames are consistently slow), and updates the laptop screen in small strips. Reduced-motion preferences are respected.

## Languages

The language comes from `?lang=nl|en|ar`, then a saved choice, then the browser languages; visitors with Dutch in their browser languages get Dutch. Translatable elements carry `data-i18n` keys. Arabic switches the page to right-to-left, mirrors the 3D laptop and its screens, and uses Alexandria for headings and IBM Plex Sans Arabic for text.

See [asset sources](docs/ASSETS.md) for third-party attributions. GitHub Pages deploys the static build automatically after a successful push to `main`. The configured custom domain is `mtsm.dev`. See [hosting details](docs/HOSTING.md).
