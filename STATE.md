# STATE — diamond-site

## Milestone
The contact + payment homepage is live on GitHub Pages. Two owner refinements landed on
top of it: the desktop contact line was enlarged (committed + pushed), and the top mobile
nav ("Services / Our Approach / Build a Quote Request") was removed from `index.html`
(done locally, **not yet committed**). Remaining work: commit/push the nav removal,
optionally sync it to the prototype/review pages, launch-time copy cleanup, and owner
confirmations. No backend/submission integration.

## Current site (verified in-browser)
- Contact strip: `tel:+19172703611`, text "Call for a consultation · (917) 270-3611".
  Desktop (>720px) **20px** with padding `13px 15px`; mobile (≤720px) **14px** with padding
  `10px 12px`. No horizontal overflow at 390px. Rule:
  `@media(min-width:721px){.contact-strip{font-size:20px;padding:13px 15px}}`.
- Top mobile nav **removed from `index.html`**: the `<nav class="mobile-nav">` element and
  its dead `.mobile-nav` CSS (base `display:none` + the ≤720px rules) were deleted. The
  contact strip is now the first content after the "Skip artwork…" link. (Desktop already
  hid the nav, so this is a mobile-facing change; mobile users reach sections by scrolling
  or the skip link.)
- Footer payment row (unchanged; replaces the old "No verified contact…" sentence):
  Cash App mark · Zelle® · Apple Pay mark · collapsed "Payment details" disclosure
  (Checks and cash accepted / Cash App: $HMHR25 / Zelle: (917) 270-3611 / Apple Pay accepted).
- Artwork: `webp-candidates/c1-original-q85.webp`, 1080×1350, 182,900 B — converted at q85
  from the owner-supplied `c1-original-q85.jpg` (1080×1350); no upscaling ships.
  `width`/`height` are 1080×1350 in `index.html`, the prototype and the embedded review.
- **Divergence:** `index.html` is **no longer byte-identical** to the prototype. Working-tree
  `index.html` = 18,089 B; prototype = 18,495 B; embedded review = 270,819 B. The prototype
  and embedded review still contain the mobile nav (and share the 20px contact rule).
- Hardening retained: meta CSP `form-action 'none'`, submit button disabled until JS init,
  `<noscript>` notice.
- Requests are not sent and appointments are not booked (verified: no query-string leak,
  no form-data requests).

## Repo / deploy
- Branch `main` == `origin/main` @ `6029dc5` ("updates on handoff and prototype files");
  preceding `6ef896d` ("enlarge desktop contact consultation line"). Both pushed.
  (Commit labels include "commercial and residentail cleaning update", but no
  commercial/residential content exists in the page yet — grep = none.)
- Working tree: only `index.html` modified (mobile-nav removal), **uncommitted**.
- GitHub Pages: legacy build, `main` /, live at https://tikistack-sudo.github.io/diamond-site/
  — currently serving the committed version (18,495 B, still has the nav).
- Local server running: `python3 -m http.server 8765 --bind 127.0.0.1`
  (pid in `/tmp/opencode/http.pid`, log `/tmp/opencode/http-serve.log`).
- Agent `git push` is denied by environment policy — the owner commits and pushes.
- Stray tracked helper: `__view-compare.html` (mobile/desktop side-by-side review page) was
  committed in `6029dc5`; it is a dev helper, not a site page — remove before launch.

## Launch-time text — see `LAUNCH-CHECKLIST.md`
The page still carries deliberate placeholder / "preview-only" copy that MUST be removed
or rewritten at launch: the builder disclosure (`#draft-note`), the `<noscript>` notice,
the footer "Design and functionality preview" suffix, the "Not Sent" headings/status
messages, draft-scope hints, FAQ answers, and the README stub.

## Open owner confirmations
- Consultation phone (917) 270-3611 was supplied as the Zelle recipient — provisional.
- Actual payment acceptance (checks, cash, Cash App $HMHR25, Zelle, Apple Pay).
- Cash App Pay merchant product (page uses the Cash App ref the owner supplied verbatim).
- Zelle logo permission and attribution/disclaimer requirements.
