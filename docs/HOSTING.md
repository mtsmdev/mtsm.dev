# Hosting preparation

The output of `npm run build` is a static website in `dist/`. It can be hosted on GitHub Pages, Firebase Hosting, or another static host with HTTPS and custom-domain support.

No domain records or production deployment are configured by this repository. CI validates and builds without publishing.

For the next deployment step, choose the host, deploy the contents of `dist/`, attach `mtsm.dev`, and apply the exact DNS records supplied by that host. Retain the current domain configuration until the target deployment is verified.
