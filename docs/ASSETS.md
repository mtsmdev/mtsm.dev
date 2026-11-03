# Asset sources

## Laptop reference

The Dell XPS 15 9500 geometry, material metadata, and textures in `prototype/assets/xps/` originate from the HMX viewer supplied as the design reference:

https://content.hmxmedia.com/dell/xps-15-9500-laptop/index.html

The manifest retains the source URL. `xps-reference.js` adapts the geometry and hinge for the portfolio. This project does not claim authorship or ownership of Dell or HMX assets or trademarks.

## Three.js

`prototype/vendor/three.module.js` and `RoomEnvironment.js` are from Three.js r170 (MIT). The original license headers are retained; see `prototype/vendor/LICENSE.three.txt`.

## CV and project imagery

The CV PDF, its rendered preview, and Amposter screenshots were provided by Moatasem via his CV. The ThermaVoltFlow screenshot comes from the project repository:

https://github.com/mtsmdev/thermavolt/blob/main/docs/design-concepts/implemented-simulation-controls.jpg

## Fonts

Google Fonts provides DM Sans and Barlow Condensed through the stylesheet imports. Their external availability affects font loading; the site includes system fallbacks.
Arabic text uses Alexandria (headings) and IBM Plex Sans Arabic (text), also from Google Fonts.

## Icons

- Technology and brand logos in `prototype/assets/icons/` come from [Simple Icons](https://simpleicons.org) 16.36.0 (CC0 1.0). The logos remain trademarks of their owners and are used only to name the technology.
- `grpc.svg`, `angularmaterial.svg`, `windows11.svg`, `powershell.svg`, `java.svg` and `linkedin.svg` come from [devicon](https://devicon.dev) 2.18.0 (MIT). `rxjs.svg` and `motion.svg` are also from devicon but are not currently used.
- Interface icons (navigation, arrows, copy, lock) are [Lucide](https://lucide.dev) 1.66.0 (ISC), inlined as an SVG sprite in `index.html`.
