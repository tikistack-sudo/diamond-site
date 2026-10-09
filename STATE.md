# STATE — diamond-site

## Milestone
The contact + payment prototype is integrated into the homepage; all work is committed
and pushed and GitHub Pages serves `index.html` at the site root. Remaining work is
launch-time copy cleanup and owner confirmations. No backend/submission integration.

## Current site (verified in-browser and by checksum)
- Homepage `index.html` is byte-identical to
  `diamond-royalty-contact-payment-prototype.html` (sha256 `faa97478…`, 18,436 B).
- Top contact strip above the artwork: `tel:+19172703611`, text
  "Call for a consultation · (917) 270-3611" (14px, ~13.7:1 contrast, keyboard reachable,
  does not overlap the artwork).
- Footer payment row (replaces the old "No verified contact…" sentence):
  Cash App mark · Zelle® · Apple Pay mark · collapsed "Payment details" disclosure
  (Checks and cash accepted / Cash App: $HMHR25 / Zelle: (917) 270-3611 / Apple Pay accepted).
- Artwork: `webp-candidates/c1-original-q85.webp`, 1080×1350, 182,900 B — converted at q85
  from the owner-supplied `c1-original-q85.jpg` (1080×1350). Replaces the earlier
  upscaled 1122×1402 webp (218,700 B); no upscaling ships. `width`/`height` updated to
  1080×1350 in `index.html`, the prototype and the embedded review copy.
- Hardening retained: meta CSP `form-action 'none'`, submit button disabled until JS
  init, `<noscript>` notice.
- Self-contained review copy regenerated (webp + Apple SVG as data URIs, 270,746 B).
- Requests are not sent and appointments are not booked (verified: no query-string leak,
  no form-data requests).

## Repo / deploy
- Branch `main` == `origin/main` @ `cee140f`; working tree clean.
  (Commit labels include "commercial and residentail cleaning update", but no
  commercial/residential content exists in the page yet — grep = none.)
- GitHub Pages: legacy build, `main` /, live at https://tikistack-sudo.github.io/diamond-site/
- Local server running: `python3 -m http.server 8765 --bind 127.0.0.1`
  (pid in `/tmp/opencode/http.pid`, log `/tmp/opencode/http-serve.log`).
- Agent `git push` is denied by environment policy — the owner commits and pushes.

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
