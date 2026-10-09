# TASKS

- [x] DONE — Repo review with prioritized findings. Proof: findings recorded in
  session (entry points, fonts href bug in superseded `file (1).html`, dead CTAs,
  2.3 MB image, alts, mobile nav, a11y).
- [x] DONE — 9 WebP candidates (c1/c2/c3 × q80/85/90) + comparison gallery.
  Proof: measured bytes, PSNR, halo/banding metrics; gallery archived intact at
  `archive/webp-gallery/`. Model visual inspection not possible — flagged.
- [x] DONE — Swap default WebP into the entry HTML + approved enabling fix for the
  pre-existing `.join('\n')` SyntaxError.
- [x] DONE — Harden request builder (CSP / disabled-until-init / `<noscript>`) in both
  original HTML files. Proof: test matrix PASS for normal and failure modes; control
  probes (no-CSP control leaked `?name=…`; CSP blocked it, URL clean, zero form-data).
- [x] DONE — Archive unnecessary files so only the intended pages render.
- [x] DONE — Contact + payment prototype (2 HTML files + official Apple Pay mark).
  Proof: focused 3-addition diff (scoped CSS, contact strip, footer payment row);
  browser tests PASS (exact `tel:` href, strip not overlapping artwork, row items,
  contrast, details by keyboard + pointer, 390px no overflow, hotspots unchanged,
  console clean).
- [x] DONE — Integrate contact/payment into `index.html`.
  Proof: `index.html` byte-identical to the prototype; round-trip diff = previous homepage.
- [x] DONE — Convert the owner-supplied JPG → WebP and update it where relevant.
  Proof: `c1-original-q85.webp` 1080×1350, 182,900 B, served `200 image/webp`; all three
  pages report natural 1080×1350; hotspot geometry unchanged.
- [x] DONE — Local deploy (`127.0.0.1:8765`) + closeout docs.
- [x] DONE — Owner committed and pushed all site work (`4435b2f` → `63e3d95` → `cee140f`);
  GitHub Pages serving `index.html` as the homepage.
- [ ] OPEN — Launch-time text removal/replacement: see `LAUNCH-CHECKLIST.md`.
- [ ] OPEN — Owner confirmations: consultation phone use, payment acceptance,
  Cash App Pay product, Zelle permission and attribution.
- [ ] OPEN — Client manual checks: visual alignment, downloaded draft contents,
  true JS-disabled behavior + `<noscript>` rendering, primary clipboard access.
- [ ] OPEN — If a real submission endpoint is connected: revisit CSP `form-action 'none'`
  and rewrite the "draft / not sent" copy.
