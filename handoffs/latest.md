# Handoff — latest

## Milestone
Hardening accepted for local/client review; leftover artifacts archived so only the
intended pages render. Ready for client manual review. No deploy, no commits.

## Verified facts
- Two deliverables: `diamond-royalty-functional-preview.html` (external asset;
  needs `webp-candidates/c1-original-q85.webp`, 1122×1402, 218,700 B) and
  `diamond-royalty-functional-preview-embedded-review.html` (self-contained).
- Both carry the hardening: CSP `form-action 'none'` (enforced — verified by probe),
  submit button disabled in HTML until JS handlers register, `<noscript>` notice.
- Test matrix PASS (normal + no-JS proxy + forced init failure, button and Enter);
  in failure modes: no form values in URL, no form-data requests. Downloads landed
  as `diamond-royalty-request.txt`; copy fallback engaged (no clipboard permission here).
- Repo root: two HTMLs, `README.md`, `webp-candidates/` (dependency only).
  `archive/`: `file.html` + `generated-image.png` + 2 enhanced PNGs +
  `webp-gallery/` (index, 9 candidates, 66 crops — functional).

## Blockers
- Model-side visual inspection impossible (no vision): visual alignment and
  `<noscript>` rendering under a truly JS-disabled browser need human eyes.

## Next actions (1–3)
1. Client runs the four manual checks: visual alignment, downloaded draft contents,
   true JS-disabled behavior + `<noscript>` rendering, primary clipboard access.
2. Decide commit scope (site HTMLs, required WebP, state docs) — approval required
   before any commit/push.
3. Later, if going live: connect a real submission endpoint (currently none by
   design; CSP `form-action 'none'` must then be revisited).

## Files touched (this closeout)
- Moved → `archive/`: `file.html`, `generated-image.png`,
  `generated-image-enhanced.png`, `generated-image-enhanced-1x.png`,
  `webp-candidates/index.html`, `webp-candidates/crops/` (66), 8 non-default
  candidate WebPs.
- Copied → `archive/webp-gallery/c1-original-q85.webp` (keeps archived gallery working).
- Created: `STATE.md`, `TASKS.md`, `DECISIONS.md`, `handoffs/latest.md`.
- Unchanged: both preview HTMLs, required WebP, `README.md`.

## Approval pending
Commits/push, deploy, backend integration — all on hold. No secrets or real
personal data in this repo (test data was fictional).
