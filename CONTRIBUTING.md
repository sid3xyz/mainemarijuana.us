# Contributing

Bring changes like a seasoned floor manager: tidy, compliant, and easy to audit.

## Quick Start

- Local server: any static server works. Python is fine:
  - `python3 -m http.server 8000`
- Link check before you push:
  - `lychee --config .lychee.toml --no-progress **/*.html`
- JS-free by default: Only include `script.js` or modules on pages that need interactivity (search, calculator, filters, print buttons). Keep static pages pure HTML/CSS.
- Accessibility: Skip links, semantic headings, `aria-label`/`aria-labelledby`, `aria-live` where appropriate. Prefer native controls.
- Print: Verify print preview for printable resources. Nav should hide; text should be readable with good contrast.

## Pull Requests

Use the PR template checklist. In short:

- Keep scope focused and changes small.
- Run link checks and fix or mark exclusions.
- Respect `_headers` security policy and CSP. If you need a new external origin, propose a CSP update in the same PR.
- Bump the footer version when policy or layout meaningfully changes. See README for guidance.

## Repository Standards

- No build step. Don’t introduce bundlers or frameworks.
- CSS: keep tokens in `styles.css` and use BEM-ish naming.
- JS: vanilla modules only; progressive enhancement. Avoid global scope.
- Caching & security live in `_headers`. HTML should be `no-cache`; assets are immutable for 1 year.

## Tooling

- Link checking: lychee (config in `.lychee.toml`).
- CI: GitHub Action `Link Check` runs on pull requests and main.

## License & Attribution

Public reference archive. Not legal advice. Source materials belong to their respective owners. Respect the Maine OCP terms and policies when linking or mirroring.
