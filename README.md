# MaineMarijuana.us

Standalone public reference portal for Maine adult-use cannabis operations and compliance. Static HTML/CSS/JS with no build step; does **not** depend on the main `sid3.xyz` site assets.

## Contents
- `index.html` – Search-first landing that filters all resources and links only to downstream pages.
- `tools.html` – Budtender utilities: purchase limit calculator and quick-reference checklists.
- `compliance_guide.html` – Retail Operations Playbook (auto Table of Contents, anchors, print friendly layout).
- `summary-compliance.html` – Retail Operations Playbook snapshot of frontline duties and escalation triggers.
- `summary-title28-b.html` – High-level map of the full statute.
- `summary-title28-bch1.html` / `summary-title28-bch3.html` – Chapter-specific briefs for quick consultation.
- `styles.css` – Self-contained design system (dark theme, responsive, print styles, summary layouts, search UI, simple header).
- `script.js` – Optional enhancements for interactive pages only: heading IDs, TOC generation, scrollspy, print triggers, search UI, resource filtering, DOB calculator, hash focus helpers. No header/nav JS.
- `sitemap.xml` – Canonical URLs advertised to crawlers via `robots.txt`.
- `guidencedocs/title28-B.pdf`, `guidencedocs/title28-Bch1.pdf`, `guidencedocs/title28-Bch3.pdf` – Statute source documents (placeholders if not yet present).

## Design Principles
- Fast static HTML: no build step required.
- Dark-first UI with accessible contrast.
- Print view strips navigation & chrome automatically.
- Each section clearly cited (statutory references use short form in italics).
- All edible product weight (not just THC) counted in examples to reinforce rule.

### JavaScript usage policy
- JS-free by default: Do not include `script.js` on purely static pages (landing, roles, downloads, guide summaries, METRC landing, static training and quick references).
- Include `script.js` only on pages that need it:
   - `search.html` (resource search UI)
   - `tools.html` (purchase calculator)
   - `resources/` print pages (print button) and `resources/index.html` (print toolbar and filter)
   - `guidencedocs/index.html` (document search)
- If adding new interactive behavior, scope it to that page; avoid loading site-wide JS unnecessarily.


## Purchase Limit Quick Reference
| Category | Limit |
|----------|-------|
| Total Aggregate Possession (Per Transaction) | 2.5 oz (70.87 g) |
| Concentrate (sub-limit within total) | 10 g |
| Edible THC per serving | 10 mg |
| Edible THC per package | 200 mg |

Entire edible product **weight** counts toward the 2.5 oz total.

## Printing
Use the browser Print dialog on any page in `resources/`. Navigation chrome is suppressed automatically.

### Print Output & Troubleshooting
- Paper: US Letter 8.5" × 11" (Portrait)
- Scale: 100% (do not use Fit to page)
- Margins: Default/Normal (~0.5")
- Background graphics: Enable to preserve subtle tints and label chips
- Headers/footers: Disable browser headers/footers

Browser notes:
- Chrome/Edge: In the print dialog, expand More settings → check Background graphics and set Scale 100%. Disable Headers and footers.
- Firefox: In the print dialog, open Options → enable Print backgrounds (colors & images); set Scale 100% and uncheck print headers/footers.
- Safari: In the dialog, open the drop-down (Details) → enable Print backgrounds; set Scale 100% and uncheck headers/footers.

Known behaviors:
- Table headers repeat across pages when the table has a proper `<thead>` and print styles are applied.
- Complex grid sections are simplified in print to avoid awkward page breaks.
- Color fidelity depends on “Background graphics” being enabled in the browser’s print dialog.

## Versioning
- All footers currently display `v1.77`.
- Increment the version string when:
   - Policies change materially (new limits, rules, or procedures), or
   - Layout / navigation shifts that affect documentation.
- Pure typo or wording updates do not require a bump.

## Accessibility
- Skip link available.
- Scrollspy updates current section in TOC on the full guide.
- Search field announces remaining result count.
- Color contrast tested against WCAG AA for body and primary UI elements.

### Header & navigation
- Simple, CSS-first header using native `<details>/<summary>` for the menu on small screens; no JavaScript required.
- Print mode hides the header automatically; layout is grid-based and avoids overlaps.

## Header maintenance
- Each page may include its own header markup. The homepage (`index.html`) shows the canonical example.
- Avoid heavy JS for navigation; prefer semantic HTML and CSS for resilience and print readiness.

## Archival & Preservation Notes
- Aligns with the Maine Office of Cannabis Policy guidance archive messaging that materials are provided “to provide interested parties with access to information of importance to industry stakeholders.”
- Follow Maine.gov [web policies](https://www.maine.gov/portal/policies/index.html) when mirroring content or linking to state resources.
- For long-term storage, consider packaging major releases with a BagIt bundle (see the Library of Congress [digital preservation tools](https://www.loc.gov/preservation/digital/)) so offline archives stay verifiable.

## Disclaimer
Public reference archive. Not legal advice. Always verify ambiguous situations using official Maine OCP publications or qualified legal counsel.

---
Maintainer: sid3.xyz

## Cloudflare Pages Deployment
- Root directory: repository root (no build step)
- Build command: none (static site)
- `_headers`: controls caching and security headers; HTML is `no-cache`, assets are long-lived `immutable`, and a strict CSP is defined
- `_redirects`: permanent 301 redirects for moved statute PDFs (preserves bookmarks)
- `robots.txt`: allows indexing for all paths and advertises the sitemap; 404 pages have `noindex, nofollow`
- `sitemap.xml`: canonical URL list consumed by crawlers
- GitHub Action `linkcheck.yml`: runs link checks on PRs and pushes to main

To go live:
- Create a Cloudflare Pages project from this GitHub repo
- Set “Build command” to empty and “Output directory” to `/`
- Verify headers via browser devtools (Cache-Control, security headers)
- Review print preview and JS-disabled readability on key pages

## CI and Link Checking

- Link checks run automatically on pull requests and on pushes to `main` via the "Link Check" workflow.
- Local link check (same settings as CI):

```bash
lychee --config .lychee.toml --no-progress **/*.html
```

See the PR template for the pre-merge checklist, including JS-free-by-default and accessibility passes.
