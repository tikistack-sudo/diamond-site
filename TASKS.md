# TASKS

- [x] DONE — Repo review with prioritized findings. Proof: findings recorded in
  session (entry points, fonts href bug in superseded `file (1).html`, dead CTAs,
  2.3 MB image, alts, mobile nav, a11y).
- [x] DONE — 9 WebP candidates (c1/c2/c3 × q80/85/90) + comparison gallery.
  Proof: measured bytes, PSNR, halo/banding metrics; gallery archived intact at
  `archive/webp-gallery/`. Model visual inspection not possible — flagged.
- [x] DONE — Swap default `c1-original-q85.webp` into the entry HTML + approved
  enabling fix for the pre-existing `.join('\n')` SyntaxError.
  Proof: focused diff (3 hunks; 1,205,977 → 16,472 B), browser tests (image 200,
  aspect preserved, hotspots aligned, full quote flow, no query leak).
- [x] DONE — Harden request builder (CSP / disabled-until-init / `<noscript>`) in
  both HTML files. Proof: focused diff (4 hunks per file), test matrix PASS for
  normal and failure modes, Enter-key and button clicks, control probes
  (no-CSP control leaked `?name=…` as expected; CSP variants blocked with
  logged violations, URL clean, zero form-data requests).
- [x] DONE — Archive unnecessary files so only intended pages render.
  Proof: root listing after move (two HTMLs + README + `webp-candidates/`
  containing only the required WebP); `archive/` inventory below.
- [ ] OPEN — Client manual checks: visual alignment, downloaded draft contents,
  true JavaScript-disabled behavior + `<noscript>` rendering, primary clipboard
  access. (State files: not machine-verifiable in this environment.)
- [x] DONE — Closeout handoff written (`handoffs/latest.md`).
- [ ] OPEN — Commit scope decision. Approval pending; nothing committed;
  no `.gitignore` (declined).
