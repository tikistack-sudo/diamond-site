# Handoff — latest

## Milestone
The contact + payment homepage is live on GitHub Pages. Two owner refinements landed on
top: the desktop contact line was enlarged (committed + pushed), and the top mobile nav was
removed from `index.html` (local, uncommitted). Next: commit/push the nav removal, decide
whether to sync it to the prototype/review pages, then launch-time copy cleanup.

## Verified facts (in-browser + checksum)
- Contact strip: `tel:+19172703611`, text "Call for a consultation · (917) 270-3611".
  Desktop (>720px) **20px** / padding `13px 15px`; mobile (≤720px) **14px** / padding
  `10px 12px`. No overflow at 390px.
  Rule: `@media(min-width:721px){.contact-strip{font-size:20px;padding:13px 15px}}`.
- Mobile nav removed from `index.html`: `.mobile-nav` occurrences = 0; contact strip is the
  first content after the "Skip artwork…" link; verified at desktop 1000px and mobile 390px
  (no nav, no overflow).
- Working-tree `index.html` = 18,089 B, sha256 `9ed3cf9a…`; **uncommitted** (only modified
  file). Committed HEAD `index.html` = 18,495 B (still has the nav).
- `main` == `origin/main` @ `6029dc5` ("updates on handoff and prototype files"); preceding
  `6ef896d` ("enlarge desktop contact consultation line"). Both pushed.
- Live homepage https://tikistack-sudo.github.io/diamond-site/ currently serves the
  committed version (18,495 B, nav still present).
- Prototype = 18,495 B and embedded review = 270,819 B still contain the mobile nav and
  share the 20px rule — **no longer byte-identical** to `index.html`.
- Artwork `webp-candidates/c1-original-q85.webp`, 1080×1350, 182,900 B.
- Hardening intact: meta CSP `form-action 'none'`, submit disabled until JS init, `<noscript>`.
- No request is sent and no appointment is booked (no query leak, no form-data).
- Local server running on `127.0.0.1:8765` (pid in `/tmp/opencode/http.pid`).

## Blockers / limits
- Agent `git push` is denied by environment policy; the owner commits and pushes.
- No model image vision: visual alignment, `<noscript>` rendering under a truly JS-disabled
  browser, and clipboard permission need human eyes.
- Unresolved owner facts: consultation-phone use, payment acceptance, Cash App Pay product,
  Zelle permission/attribution.
- Stray tracked helper `__view-compare.html` (committed in `6029dc5`) should be removed
  before launch — it is not part of the site.

## Next actions (1–3)
1. Commit + push the `index.html` mobile-nav removal (owner does the push).
2. Decide whether to remove the nav on the prototype + embedded review too, to keep the
   pages aligned.
3. Launch: apply `LAUNCH-CHECKLIST.md`, remove `__view-compare.html`, and revisit the CSP if
   a real submission endpoint is added.

## Files touched (this update)
- Modified: `STATE.md`, `TASKS.md`, `DECISIONS.md`, `handoffs/latest.md`.
- Not touched by this doc update: `index.html` (nav removal) remains modified in the working
  tree, uncommitted.

## Approval pending
Owner push of the nav-removal commit; owner decision on syncing the nav removal to the
prototype/review pages; owner confirmations listed above. No secrets in the repo; test data
was fictional.
