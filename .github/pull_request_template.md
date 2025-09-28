## Summary

Explain the change in one or two sentences. What improves and why?

## Checklist

- [ ] JS-free by default: Only load `script.js` or modules on pages with interactive behavior (search, calculator, filters, print buttons). Static pages remain JavaScript-free.
- [ ] Accessibility pass: Skip link present, headings hierarchical, landmark roles used appropriately; interactive controls have labels; `aria-live` where needed.
- [ ] Links: Ran local link check with lychee and fixed or excluded any offenders.
- [ ] Print view: Verified print preview for any new/changed printable pages (hide nav, proper contrast, no cut-off content).
- [ ] Headers/CSP: Changes comply with `_headers` (no new inline scripts beyond current policy; no external origins without CSP update).
- [ ] Version string: Bumped footer version if policy/layout changes affect public docs (see README Versioning).
- [ ] Docs: Updated README/CONTRIBUTING if behavior or workflow changed.

## Validation

- Local server smoke test screenshots or notes
- Lychee output snippet (first 50 lines is fine)

## Notes

Anything reviewers should pay special attention to (tradeoffs, follow-ups).
