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
- [x] DONE — Enlarge the desktop contact line (owner: too small on full desktop view, then
  one more step up, desktop-only). Proof:
  `@media(min-width:721px){.contact-strip{font-size:20px;padding:13px 15px}}` (mobile stays
  `14px`); verified desktop 1000px = 20px, mobile 390px = 14px, no overflow; committed
  `6ef896d` (`index.html`) and pushed in `6029dc5`.
- [x] DONE — Remove the top mobile nav ("Services / Our Approach / Build a Quote Request")
  above the contact line on `index.html` (owner request; reverses the earlier "preserve
  mobile nav" rule). Proof: `.mobile-nav` occurrences = 0; contact strip is the first
  content after the skip link; verified in-browser at desktop 1000px and mobile 390px
  (no nav, no overflow, desktop rule intact). **Uncommitted** (`index.html`, 18,089 B).
- [x] DONE — Docs closeout via handoff skill (this update).
- [ ] OPEN — Commit/push the `index.html` mobile-nav removal (local, uncommitted; owner pushes).
- [ ] OPEN — Sync the mobile-nav removal to `diamond-royalty-contact-payment-prototype.html`
  and `diamond-royalty-contact-payment-embedded-review.html` (they still contain it) if the
  pages should stay aligned.
- [ ] OPEN — Remove the stray tracked helper `__view-compare.html` (side-by-side review page
  committed in `6029dc5`; not a site page) before launch.
- [ ] OPEN — Launch-time text removal/replacement: see `LAUNCH-CHECKLIST.md`.
- [ ] OPEN — Owner confirmations: consultation phone use, payment acceptance,
  Cash App Pay product, Zelle permission and attribution.
- [ ] OPEN — Client manual checks: visual alignment, downloaded draft contents,
  true JS-disabled behavior + `<noscript>` rendering, primary clipboard access.
- [ ] OPEN — If a real submission endpoint is connected: revisit CSP `form-action 'none'`
  and rewrite the "draft / not sent" copy.
- [x] DONE — RUNBOOK.md created (launch runbook: Cloudflare Pages + D1 + Resend; owner
  steps separated from cheap-model tasks T1–T7 with full prompts). Proof: 7 tasks ×
  9 mandatory sections, architecture + cost table, rollback notes.
- [x] DONE — Milestone 1 (human verified): site live at diamondroyaltycleaningco.com.
  Proof: agent curl → HTTP 200, valid TLS; ⚠️ www variant returns 522 (open).
- [x] DONE — T1: `schema.sql` (D1 bookings table + 2 indexes). Proof: file matches
  prompt exactly; untracked only.
- [x] DONE — T2: `functions/api/booking.js` (validate → D1 insert → 2 Resend emails;
  honeypot; 400/413/500/405). Proof: `node --check` pass (ESM via .mjs copy); grep
  counts 1/1.
- [x] DONE — T3: form rewired (phone field + required name/email, honeypot, result
  receipt, "Send My Request", script replaced). Proof: 8 anchors ×1, all greps green,
  inline JS `node --check` pass, in-browser: submit enabled, honeypot hidden, console
  clean, screenshot verified.
- [x] DONE — T4: CSP → `form-action 'self'; connect-src 'self'`. Proof: grep counts 0/1.
- [x] DONE — T5: launch copy rewritten (draft-note, noscript, footer, ack, 3 FAQ
  answers). Proof: all old strings 0, new strings 1, §7 hint untouched.
- [x] DONE — T6: dev-only pages archived (`git mv`×4 — 2 beyond original scope, flagged
  in RUNBOOK; `git rm __view-compare.html`). Proof: `ls *.html` → only `index.html`.
- [x] DONE — T7: real README. Proof: 1,605 B, references RUNBOOK.md.
- [x] DONE — MILESTONE 3 executed by agent via REST (pivot: site is a Worker, not
  Pages): D1 `bookings` created + schema applied (verified table+indexes); Resend domain
  added + 4 DNS records created in zone; `www` attached as Workers custom domain
  (522 → 200); bindings DB/RESEND_API_KEY/BOOKING_NOTIFY_EMAIL (both CEO emails) set on
  the `diamond-site` Worker. Proof: DECISIONS #16–17, STATE.md evidence block.
- [x] DONE — Architecture pivot: `worker.js` (site + API in one Worker) replaces
  `functions/`; `wrangler.jsonc` added. Proof: live POST → 201 + D1 row #1; invalid
  ZIP → 400; new copy + assets served 200; www 200.
- [ ] OPEN — Owner: check CEO inboxes for the test notification; owner commit + push;
  revoke the Cloudflare API token; disable the stale GitHub Pages copy.
