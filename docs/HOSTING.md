# GitHub Pages hosting

The website is published from `.github/workflows/pages.yml`. Each push to `main` validates the application, builds `dist/`, uploads the static artifact, and deploys through the `github-pages` environment. Pull requests run the separate validation workflow without publishing.

## Domain

The GitHub Pages custom domain is `mtsm.dev`. DNS is managed by Dynadot using the existing Dynadot nameservers.

| Host | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | mtsmdev.github.io |

The DNS TTL is five minutes. Existing Dynadot email forwarding remains in Email Settings; do not duplicate or replace its managed MX and SPF records in the DNS editor.

GitHub provisions the HTTPS certificate after DNS validation. Enable Enforce HTTPS when the certificate is ready. A custom Actions deployment does not require a CNAME file in the artifact; the domain is managed in the repository Pages settings.

## Local checks

```sh
npm run check
npm run build
```

The production artifact contains only website files, assets, and the vendored runtime. Local research, screenshots, duplicate original CV, experimental scenes, and the development server are excluded.
