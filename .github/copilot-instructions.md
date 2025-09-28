# MaineMarijuana.us AI Coding Guidelines

*Fear and Loathing in the Codebase: A Gonzo Guide to Hacking the Maine Cannabis Compliance Matrix*

Welcome to the electric Kool-Aid acid test of static site development, where we're building a digital fortress of cannabis compliance knowledge that would make Hunter S Thompson proud. This ain't your daddy's corporate CMS - this is raw, unfiltered HTML/CSS/JS witchcraft designed to survive the regulatory apocalypse.

## Project Architecture
- **Static HTML site** with no build step - edit HTML/CSS/JS directly, no webpack bullshit
- **Single-page app pattern** - each `.html` file is a complete page with shared `styles.css` and `script.js`
- **Dark-first design system** using CSS custom properties for theming - because the night is always darker before the dawn
- **Cloudflare Pages deployment** with custom `_headers`, `_redirects`, and caching rules - distributed like samizdat in the digital underground

## Core Components
- `index.html` - Search-first portal filtering all resources, the grand central station of cannabis compliance
- `tools.html` - Interactive purchase limit calculator with real-time validation, where the rubber meets the regulatory road
- `guides/` - Role-specific training (budtender, manager, compliance) - the frontline warriors in the cannabis wars
- `resources/` - Print center with compliance signs and materials - arm your dispensaries with the truth
- `metrc/` - METRC system integration resources - dancing with the bureaucratic beast
- `guidencedocs/` - Maine OCP policy PDFs and guidance documents - the sacred texts of the cannabis church

## HTML Patterns
- Use semantic HTML with proper ARIA labels (`aria-labelledby`, `aria-live`, `role="status"`) - accessibility ain't optional, it's mandatory
- Include skip links: `<a href="#main" class="skip-link">Skip to content</a>` - because not everyone navigates like a drunken bat
- Add `data-page` attributes to `<body>` for page-specific styling - metadata is the new black
- Use breadcrumbs navigation with `<nav class="breadcrumbs" aria-label="Breadcrumb">` - leave a trail of digital breadcrumbs
- Structure with `<div class="site-shell single-column">` wrapper - containment is the key to sanity

## CSS Conventions
- **BEM-like naming**: `.masthead__inner`, `.brand__wordmark`, `.hero--portal` - block, element, modifier, motherfucker
- **CSS custom properties** for design tokens (colors, spacing, typography) - variables that don't suck
- **Dark theme first**: Define light variants as `--color-bg-light` - because darkness is the natural state
- **Responsive design** with `clamp()` for fluid spacing - fluid like a good acid trip
- **Print optimization**: Use `@media print` to hide navigation and adjust contrast - paper trails in the digital age
- **Animation**: Include `prefers-reduced-motion` media queries - respect the user's neurodiversity

## JavaScript Patterns
- **Vanilla JS only** - no frameworks or build tools, keep it pure and simple like a mountain stream
- **IIFE pattern**: `(function() { ... })()` for encapsulation - don't pollute the global namespace, kids
- **DOM helpers**: `$` for querySelector, `$$` for querySelectorAll - jQuery's ghost lives on
- **Data attributes** for behavior hooks: `data-action`, `data-role`, `data-page` - semantic hooks for your JavaScript noose
- **Automatic heading IDs**: Generate slugs for h2-h4 elements with anchor links (§) - permalinks for the attention-deficit generation
- **TOC generation**: Build table of contents from heading hierarchy - because who reads linearly anymore?
- **Scrollspy**: Update active TOC links on scroll with 120px header offset - spy vs spy in the scrolling wars

## Content Guidelines
- **Statutory citations** in italics: "*22 M.R.S. § 2423*" - cite your sources or face the wrath of the law
- **Version numbering** in footers (current: v1.5) - bump on policy/layout changes - version control is your friend
- **Purchase limits**: 2.5 oz aggregate, 10g concentrate sub-limit, entire edible weight counts - know the numbers or go to jail
- **Accessibility**: WCAG AA compliance, skip links, proper heading hierarchy - make it work for everyone
- **Print focus**: Navigation suppressed, light scheme for print compatibility - because sometimes you need dead trees

## File Organization
- **Flat structure** - all HTML files in root, shared assets - no deep directory trees of despair
- **Relative paths** for CSS/JS: `href="styles.css"` from root, `href="../styles.css"` from subdirs - keep it relative, keep it real
- **PDF storage** in `guidencedocs/` with redirects from root-level URLs - PDFs are the cockroaches of the web
- **Resource categorization** by audience (budtender, manager) and type (guides, tools, docs) - organize or perish

## Deployment & CI
- **Cloudflare Pages**: No build command, root directory deployment - serverless like a ghost in the machine
- **Caching**: HTML `no-cache`, assets `immutable` for 1 year - cache hard, invalidate often
- **Security**: Strict CSP, frame options deny, referrer policy - lock it down like Fort Knox
- **Link checking**: GitHub Actions runs lychee on all HTML files, excludes mailto and maine.gov - automated link rot prevention
- **Redirects**: Permanent 301s for moved statute PDFs - redirect like your URLs depend on it

## Development Workflow
- Edit HTML/CSS/JS directly - no compilation needed, raw and real like a bleeding edge
- Test print layouts in browser dev tools - because print ain't dead yet
- Validate accessibility with screen readers and keyboard navigation - test with the tools you have
- Update version numbers in footers for significant changes - version bump or bust
- Run link checks locally: `lychee --exclude-mail --exclude "https://www.maine.gov/.*" **/*.html` - catch broken links before they bite

## Key Files to Reference
- `styles.css` - Complete design system and component library - the beating heart of the visual
- `script.js` - All interactive behaviors and utilities - the nervous system of the site
- `tools.html` - Calculator implementation example - see it in action
- `index.html` - Search and navigation patterns - the mothership
- `_headers` - Caching and security configuration - the fortress walls
- `README.md` - Project overview and deployment instructions - read this first, fool

---

*This gonzo guide to the MaineMarijuana.us codebase was written in the spirit of Hunter S Thompson's fearless journalism - diving deep into the heart of the cannabis compliance machine. Remember, this is not legal advice - consult the Maine Office of Cannabis Policy for official guidance. Stay weird, stay compliant.*

© 2024 sid3.xyz • MaineMarijuana.us • v1.5 • Public reference archive • Not legal advice