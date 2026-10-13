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
- [x] DONE — Commit/push the `index.html` mobile-nav removal. Proof: owner commit
  `b893349` is `origin/main`.
- [x] DONE — Sync the mobile-nav removal to the prototype/review pages. Superseded: those
  pages were archived in T6 (see below), so the repo root serves only `index.html`.
- [x] DONE — Remove the stray tracked helper `__view-compare.html`. Proof: `git rm` in T6;
  commit `63c7075`.
- [x] DONE — Launch-time text removal/replacement (`LAUNCH-CHECKLIST.md`): §1–6 and §9
  rewritten (T3 result block + T5 copy edits); §8 draft-sharing hint removed with the
  result block; §10 README rewritten (T7). Deliberately NOT touched: §7 scope hint
  (business claims pending owner confirmation).
- [x] DONE — Revisit CSP for the real submission endpoint. Proof: `form-action 'self';
  connect-src 'self'` (T4); same-origin POST verified live.
- [x] DONE — Client manual checks, original scope. Superseded: the draft/copy/download
  feature was removed; the form now submits for real. Replaced by live-site checks
  below.
- [x] DONE — Final end-to-end verification (Resend verified Oct 11). Proof: booking #3 →
  201 + `owner_emailed: true` (both CEO addresses); real-address probe → 200 + email id;
  `example.com` 422 = reserved-domain rule, not a bug; D1 rows #1/#3 stored; www → 200.
- [x] DONE — Owner confirmed the pipeline works ("everything works great", Oct 11 —
  covers site, bookings, and CEO emails).
- [ ] OPEN — Owner: `git push origin main` (launch commits `63c7075` + `91fff40` are
  local only; `origin/main` still `b893349`).
- [ ] OPEN — Owner: revoke the Cloudflare API token (My Profile → API Tokens) and delete
  `/tmp/opencode/creds.env` (still present as of handoff).
- [ ] OPEN — Owner: optional — disable the stale GitHub Pages copy
  (`tikistack-sudo.github.io/diamond-site/`); delete test rows
  (`DELETE FROM bookings WHERE email='jane.tester@example.com';`).
- [ ] OPEN — One human pass on the LIVE site: mobile (~390px) visual alignment of the new
  form + Request Received receipt; then watch the first real booking end-to-end.
- [ ] OPEN — Owner confirmations still pending (unaffected by launch): consultation
  phone use as Zelle recipient, payment acceptance facts, Cash App Pay product, Zelle
  permission/attribution, LAUNCH-CHECKLIST §7 scope hint wording, footer nav label
  "Request Builder".
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
- [x] DONE — Resend domain verified (all 4 records); final E2E proof: booking #3 →
  `owner_emailed: true`; real-address probe → 200 + email id. Owner confirmed the
  pipeline works. Proof: RUNBOOK Milestone 5 status box; STATE.md evidence block.
- [x] DONE — Docs closeout via handoff skill (Oct 11 closeout).
- [x] DONE — APPLY-LIST (human approved Oct 12): white theme + Airbnb artwork applied to
  `index.html` (byte-identical to approved prototype, sha256 3d3bd09c…; pre-task hash
  verified before apply); `worker.js` hero import → `c1-airbnb-q82.webp` (node --check
  pass); superseded images + review prototypes archived (2 tracked `git mv` + 3 untracked
  `mv`); local preview server (PID 6352) closed, port 8788 verified closed.
  Proof: DECISIONS #19; root = index.html/worker.js/wrangler.jsonc +
  webp-candidates/c1-airbnb-q82.webp only.
- [x] DONE — PRODUCTION DEPLOY of the white theme (agent, REST, owner-supplied tokens
  from `~/.config/opencode/*.env`, handled under the source-only contract, perms 600).
  Deploy bug (route still on old webp path) caught in live verification and fixed +
  redeployed same session. Proof: live — new webp 200 (171,804 B) at
  `/webp-candidates/c1-airbnb-q82.webp`, old webp path 404, index white theme served,
  guards 400/405, www 200, screenshot confirms AIRBNB artwork + white canvas.
- [ ] OPEN — Owner: `git push origin main` (all launch + theme commits are local).
- [ ] OPEN — Owner: revoke the tokens in `~/.config/opencode/*.env` when no longer
  needed (deploy complete).
- [ ] OPEN — One human pass on the LIVE site (mobile ~390px visual), then watch the
  first real booking end-to-end.- [ ] OPEN — Owner confirmations still pending (unaffected by theme): consultation phone
  as Zelle recipient, payment acceptance facts, Cash App Pay product, Zelle permission,
  LAUNCH-CHECKLIST §7 scope hint, footer nav label "Request Builder".
