# Handoff — latest

## Milestone
The contact + payment version is live on GitHub Pages as the homepage; the repo is clean
at `cee140f`. Remaining work is launch-time copy cleanup and owner confirmations.

## Verified facts
- Homepage `index.html` == contact + payment prototype (byte-identical, sha256 `faa97478…`).
  Contact strip `tel:+19172703611` ("Call for a consultation · (917) 270-3611"); footer
  payment row (Cash App mark · Zelle® · Apple Pay mark · "Payment details" disclosure);
  old "No verified contact…" sentence removed; company identity line kept.
- Artwork `webp-candidates/c1-original-q85.webp`, 1080×1350, 182,900 B — converted at q85
  from the owner-supplied `c1-original-q85.jpg`; `width`/`height` updated in `index.html`,
  the prototype and the embedded review. Older preview files keep their original attrs
  (shared asset path, so they render the new image too).
- Hardening intact: meta CSP `form-action 'none'`, submit disabled until JS init,
  `<noscript>` notice.
- Requests are not sent and appointments are not booked (no query leak, no form-data).
- Local server running on `127.0.0.1:8765`.

## Blockers / limits
- Agent `git push` is denied by environment policy; the owner commits and pushes.
- No model image vision: visual alignment, `<noscript>` rendering under a truly
  JS-disabled browser, and clipboard permission need human eyes.
- Unresolved owner facts: consultation-phone use, payment acceptance, Cash App Pay
  product, Zelle permission/attribution.

## Next actions (1–3)
1. Apply `LAUNCH-CHECKLIST.md`: remove/replace placeholder and "not sent" copy at launch.
2. Get owner confirmations (phone, payments, Cash App Pay, Zelle).
3. If a real submission endpoint is added, revisit the CSP and the draft wording.

## Files touched (this closeout)
- Updated: `STATE.md`, `TASKS.md`, `DECISIONS.md`, `handoffs/latest.md`.
- Created: `LAUNCH-CHECKLIST.md`.
- Site files unchanged by this closeout (working tree was clean at `cee140f`).

## Approval pending
Nothing pending for local work. Launch-time text removal and any endpoint integration
require owner approval. No secrets in the repo; test data was fictional.
